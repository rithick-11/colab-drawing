import React, { useEffect, useState } from 'react'
import { useSocketStore } from '../store/useSocketStore'

const ChatBox = ({className}) => {

    const { messages, onSendMessage, socket, onReceiveMessage, setPreviosMessages } = useSocketStore()

    const [msg, setMsg] = useState('')

    useEffect(() => {
        if (!socket) return


        //handel recive msg
        const handelReciveMessage = (message) => {
            console.log(`message received at client: ${message}`)
            onReceiveMessage(message)
        }
        socket.on('receive-message', handelReciveMessage)


        //get previous msg

        const getPreviosMsg = (previousMessages) => {
            console.log('previous messages received at client:', previousMessages)
            setPreviosMessages(previousMessages)
        }
        socket.on('previous-messages', getPreviosMsg)


        return () => {
            socket.off('receive-message', handelReciveMessage)
            socket.off('messages updated', getPreviosMsg)
        }

    }, [socket])


    const onSentMsg = () => {
        onSendMessage(msg)
        setMsg('')
    }


    return (
        <div className={`${className} border`}>
            <ul className='px-3 flex flex-col gap-2 mt-3 justify-end'>
                {messages.map((m, i) => (
                    <li key={i} className='bg-white p-2 rounded-md shadow-md w-fit max-w-[70%]'>{m}</li>
                ))}
            </ul>
            <div className='flex w-full self-end gap-3 p-3'>
                <input type='text' value={msg} onChange={(e) => setMsg(e.target.value)} className='border p-3 rounded-lg w-full' />
                <button type='button' onClick={onSentMsg} className='btn bg-blue-400'>send</button>
            </div>
        </div>
    )
}

export default ChatBox