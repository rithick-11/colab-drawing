import { generateUser } from "./utils.js"

class Channel {
    channelId = null
    messages = []
    users = []

    constructor(channelId, userId) {
        this.channelId = channelId
    }

    onNewUser(userId) {
        const newUser = generateUser()
        newUser.id = userId
        newUser.pos = { x: 0, y: 0 }
        this.users.push(newUser)
        return newUser
    }

    onUserDisconnect(userId) {
        this.users = this.users.filter(user => user.id != userId)
    }

    onMouseMove(userId, pos) {
        this.users = this.users.map(user => {
            if (user.id == userId) {
                user.pos = pos
            }
            return user
        })
    }
}

const channels = {}

export const joinChannel = (socket, channelId) => {
    socket.join(channelId)
    socket.channelId = channelId

    let newUser = null

    if (!channels[channelId]) {
        channels[channelId] = new Channel(channelId)
        newUser = channels[channelId].onNewUser(socket.id)
    } else {
        newUser = channels[channelId].onNewUser(socket.id)
    }
    socket.emit('after_join_channel', channels[channelId])
    socket.to(channelId).emit('joined-new-user', newUser)
}

export const onUserDisconnect = (socket) => {
    if (!channels[socket.channelId]) {
        console.log('channel not found')
        return
    }
    channels[socket.channelId].onUserDisconnect(socket.id)
    socket.to(socket.channelId).emit('user-disconnected', channels[socket.channelId])
    socket.leave(socket.channelId)
}

export const onMouseMove = (socket, pos) => {
    if (!channels[socket.channelId]) {
        console.log('channnel not found')
        return
    }
    channels[socket.channelId].onMouseMove(socket.id, pos)
    socket.to(socket.channelId).emit('on-remote-user-mouse-move', channels[socket.channelId])
} 