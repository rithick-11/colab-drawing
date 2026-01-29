import React from 'react'
import { useParams } from 'react-router-dom'
import { Container } from '../components'
import { useSocketStore } from '../store/useSocketStore'
import { useEffect } from 'react'
import { useState } from 'react'

const Canvaschannel = () => {

  const { joinChannel, connect, messages, onSendMessage, socket, onReceiveMessage, setPreviosMessages } = useSocketStore()

  const { channelId } = useParams()

  const [msg, setMsg] = useState('')

  useEffect(() => {
    connect()
    console.log('attempting to connect to socket server')
    joinChannel(channelId)
  }, [])


  useEffect(() => {
    if (!socket) return

    const handelReciveMessage = (message) => {
      console.log(`message received at client: ${message}`)
    }
    socket.on('receive-message', (message) => {
      console.log(`message received at client: ${message}`)
      onReceiveMessage(message)
    })
    console.log('messages updated:', messages)

    socket.on('previous-messages', (previousMessages) => {
      console.log('previous messages received at client:', previousMessages)
      setPreviosMessages(previousMessages)
    })


    return () => {
      socket.off('receive-message', handelReciveMessage)
    }

  }, [socket])



  return (
    <Container className="py-5 px-2">
      <div className='min-h-[50vh] text-black bg-amber-50/80 rounded-lg flex flex-col justify-between gap-2'>
        <ul className='px-3 flex flex-col gap-2 mt-3 justify-end'>
          {messages.map((m, i) => (
            <li key={i} className='bg-white p-2 rounded-md shadow-md w-fit max-w-[70%]'>{m}</li>
          ))}
        </ul>
        <div className='flex w-full self-end gap-3 p-3'>
          <input type='text' value={msg} onChange={(e) => setMsg(e.target.value)} className='border p-3 rounded-lg w-full' />
          <button type='button' onClick={() => {
            onSendMessage(msg)
            setMsg('')
          }} className='btn bg-blue-400'>send</button>
        </div>
      </div>
    </Container>
  )
}

export default Canvaschannel