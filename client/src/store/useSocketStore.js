import { create } from "zustand";
import { io } from "socket.io-client";

export const useSocketStore = create((set, get) => ({

    //statesss
    socket: null,
    isConnected: false,
    channelId: null,
    messages: ['rithick'],
    //handeler

    //on connect to socket
    connect: () => {
        if (get().isConnected) return

        const socket = io('http://localhost:3211/')

        socket.on('connect', () => {
            set({ isConnected: true })
            console.log('socket connected to web server')
        })

        socket.on('disconnect', () => {
            set({ isConnected: false })
            console.log('socket disconnected to web server')
        })

        set({ socket })
    },

    joinChannel: (channelId) => {
        if (!get().isConnected && !channelId) return
        const { socket } = get()
        if (!socket) return
        socket.emit('join-channel', channelId)
        set({ channelId })
        console.log(`joined channel: ${channelId}`)
    },

    onSendMessage: (message) => {
        if (!get().isConnected && !get().channelId) return
        const { socket, channelId } = get()
        if (!socket) return
        socket.emit('send-message', { channelId, message })
    },

    onReceiveMessage: (message) => {
        set({ messages: [...get().messages, message] })
    },
    
    setPreviosMessages: (previousMessages) => {
        set({ messages: [...get().messages, ...previousMessages] })
    }
}))
