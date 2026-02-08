import React, { useRef, useEffect } from 'react'
import { Navigate, useParams, useSearchParams } from 'react-router-dom'
import { ChannelInfo, ChatBox, Container, RemoteMouseMove, ToolBar, UserCard } from '../components'
import { useSocketStore } from '../store/useSocketStore'
import { socket } from '../socket/socket'
import { toast } from 'react-toastify'

let currentAction = []

const Canvaschannel = () => {

  const { joinChannel, connect, setCurrenChannelState, bruseSize, brushColor, tool, whiteBoardActions, setUser } = useSocketStore()

  const { channelId } = useParams()
  const [searchParams] = useSearchParams()

  const canvaRef = useRef(null)
  const cursorRef = useRef({})
  const isDrawing = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })

  const username = searchParams.get('username')

  console.log(username)

  if(username === '' || username === null) return <Navigate to="/" />

  

  const onDrawing = (lastPos, currentPos, bruseSize, brushColor, tool) => {
    const canvas = canvaRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    ctx.lineWidth = bruseSize
    ctx.strokeStyle = brushColor
    if (tool == 'eraser') {
      ctx.strokeStyle = 'white'
    }
    ctx.beginPath()
    ctx.moveTo(lastPos.x, lastPos.y)
    ctx.lineTo(currentPos.x, currentPos.y)
    ctx.stroke()
  }

  const drawingAllStorcks = (whiteBoardActions) => {
    const canvas = canvaRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    whiteBoardActions.forEach(action => {
      action.forEach(storck => {
        onDrawing(storck.lastPos, storck.currentPos, storck.bruseSize, storck.brushColor, storck.tool)
      })
    })
  }

  useEffect(() => {
    connect()
    console.log('attempting to connect to socket server')
    joinChannel(channelId, username)
    document.title = `Canvas - ${channelId}`

    const handleRemoteDrawing = (storck) => {
      onDrawing(storck.lastPos, storck.currentPos, storck.bruseSize, storck.brushColor, storck.tool)
    }

    const handleRemoteUserMouseMove = (current_channel_state) => {
      setCurrenChannelState(current_channel_state)
    }

    const handleAfterJoinChannel = ({ channelState, user }) => {
      setCurrenChannelState(channelState)
      setUser(user)
      console.log('user joined:', user)
      console.log('updated channel state:', channelState)
    }

    const handleOnRemoteuserDisconnect = ({ current_channel_state, user }) => {
      setCurrenChannelState(current_channel_state)
      console.log('user disconnected:', user)
      console.log('updated channel state:', current_channel_state)
      toast.info(`${user.name} disconnected`)  
    }

    if (socket) {
      socket.on('after_join_channel', handleAfterJoinChannel)
      socket.on('someone_drawing', handleRemoteDrawing)
      socket.on('on-remote-user-mouse-move', handleRemoteUserMouseMove)
      socket.on('user-disconnected', handleOnRemoteuserDisconnect)
      socket.on('joined-new-user', (data) => {
        setCurrenChannelState(data.channelState)
        console.log('new user joined', data.newUser)
        toast.info(`${data.newUser.name} joined the channel`)
      })
      socket.on('on-undo-redo', (data) => {
        setCurrenChannelState(data)
        console.log('some undo', data)
      })
    }

    return () => {
      socket.off("someone_drawing")
      socket.off('on-remote-user-mouse-move')
      socket.off('user-disconnected')
      socket.off('after_join_channel')
    }
  }, [])

  useEffect(() => {
    drawingAllStorcks(whiteBoardActions)
  }, [whiteBoardActions])

  useEffect(() => {
    const canvas = canvaRef.current
    if (!canvas) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const ctx = canvas.getContext("2d")
    ctx.lineCap = 'round'
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 2
  }, [])

  const startDrawing = (e) => {
    const canvas = canvaRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    isDrawing.current = true
    lastPos.current = { x, y }
  }

  const stopDrawing = () => {
    isDrawing.current = false
    socket.emit('add-board-action', currentAction)
    currentAction = []
  }

  const handleMouseMove = (e) => {

    const canvas = canvaRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    cursorRef.current = { x, y }

    if (socket) {
      socket.emit('mouse_move', ({ channelId, pos: { x, y }, id: socket.id }))
    }

    if (isDrawing.current) {
      onDrawing(lastPos.current, { x, y }, bruseSize, brushColor, tool)
      currentAction.push({ lastPos: lastPos.current, currentPos: { x, y }, bruseSize, brushColor, tool })
      if (socket && socket.connected) {
        console.log('emitting drawing event to server')
        socket.emit('start_drawing', {
          channelId,
          lastPos: lastPos.current,
          currentPos: { x, y },
          bruseSize, brushColor, tool
        })
      } else {
        console.warn('Socket not connected, cannot emit drawing')
      }
    }

    lastPos.current = { x, y }
  }

  return (
    <Container className="bg-gray-50 mx-auto border grid grid-cols-12 grid-rows-12 gap-3 p-3">
      <div className='col-span-12 row-start-3 row-span-10 relative overflow-auto'>
        <canvas
          ref={canvaRef}
          className='rounded-2xl border border-gray-200 shadow-md mx-auto bg-white min-h-[680px] max-h-[680px]  min-w-6xl max-w-5xl'
          onMouseDown={startDrawing}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        ></canvas>
        <RemoteMouseMove />
      </div>
      <ToolBar className='col-start-3 col-span-7 row-span-2 rounded-2xl border border-gray-200 shadow-md bg-white' />
      <UserCard className='col-start-10 row-span-2 rounded-2xl border border-gray-200 shadow-md col-span-3 bg-white ' />
      <ChannelInfo className='bg-white col-span-2 row-span-2 col-start-1 row-start-1 rounded-2xl border border-gray-200 shadow-md' />
      {/* {1 == 1 ? <ChatBox className={`absolute border-amber-300 min-h-[70vh] top-[30%] text-black`} /> : null} */}
    </Container>
  )
}

export default Canvaschannel