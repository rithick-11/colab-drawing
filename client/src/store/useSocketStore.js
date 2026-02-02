import { create } from "zustand";
import { socket } from '../socket/socket'


export const useSocketStore = create((set, get) => ({
    isConnected: false,
    channelId: null,
    messages: [],
    users: [],
    whiteBoardActions: [],
    bruseSize: 2,
    brushColor: 'black',
    tool: 'brush',
    user: {
        name:"Loding"
    },

    setTool:(tool)=>{
        set({tool})
    },
    

    setUser: (user) => {
        set({ user })
    },

    setActionsCount: () => {
        set({ actionCount: get().actionCount + 1 })
    },

    setBrushColor: (color) => {
        set({ brushColor: color })
    },


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

    joinChannel: (channelId, username) => {
        if (!socket && !channelId) return
        const data = { channelId, username }
        console.log(data)
        socket.emit('join-channel', ({channelId, username}))
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
    },

    addWhiteBoardAction: (action) => {
        set({ whiteBoardActions: [...get().whiteBoardActions, action] })
        console.log(get().whiteBoardActions)
    },

    setBruseSize: (size) => {
        set({ bruseSize: size })
    }
}))
