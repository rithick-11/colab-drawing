import { create } from "zustand";
import { socket } from '../socket/socket'


export const useSocketStore = create((set, get) => ({
    isConnected: false,
    channelId: null,
    messages: [],
    users: [],
    connect: () => {
        if (get().isConnected) return

        socket.on('connect', () => {
            set({ isConnected: true })
            console.log('socket connected to web server')
        })

        socket.on('disconnect', () => {
            set({ isConnected: false })
            console.log('socket disconnected to web server')
        })

        return socket
    },

    joinChannel: (channelId) => {
        if (!socket && !channelId) return
        socket.emit('join-channel', channelId)
        set({ channelId, messages: [] })
        console.log(`joined channel: ${channelId}`)
    },

    onSendMessage: (message) => {
        if (!get().isConnected && !get().channelId) return
        const { channelId } = get()
        if (!socket) return
        socket.emit('send-message', { channelId, message })
    },

    onReceiveMessage: (message) => {
        set({ messages: [...get().messages, message] })
    },

    setPreviosMessages: (previousMessages) => {
        set({ messages: previousMessages })
    },

    setCurrenChannelState: (channel_state) => {
        set({ ...channel_state })
    }
}))
