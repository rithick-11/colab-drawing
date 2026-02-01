const { Channel, channels } = require("./roomState.js")

const joinChannel = (socket, channelId) => {
    socket.join(channelId)
    socket.channelId = channelId

    let newUser = null

    if (!channels[channelId]) {
        channels[channelId] = new Channel(channelId)
        newUser = channels[channelId].onNewUser(socket.id)
    } else {
        newUser = channels[channelId].onNewUser(socket.id)
    }
    socket.emit('after_join_channel', ({ channelState: channels[socket.channelId], user: newUser }))
    socket.to(channelId).emit('joined-new-user', ({ channelState: channels[socket.channelId], newUser }))
}

const onUserDisconnect = (socket) => {
    if (!channels[socket.channelId]) {
        console.log('channel not found')
        return
    }
    const leftUser = channels[socket.channelId].onUserDisconnect(socket.id)
    socket.to(socket.channelId).emit('user-disconnected', ({ current_channel_state: channels[socket.channelId], user: leftUser }))
    socket.leave(socket.channelId)
}

const onMouseMove = (socket, pos) => {
    if (!channels[socket.channelId]) {
        console.log('channnel not found')
        return
    }
    channels[socket.channelId].onMouseMove(socket.id, pos)
    const { whiteBoardActions, undoStack, ...currentState } = channels[socket.channelId]
    socket.to(socket.channelId).emit('on-remote-user-mouse-move', currentState)
}

const onAddBoardAction = (socket, action) => {
    if (!channels[socket.channelId]) {
        console.log('channel not found')
        return
    }
    channels[socket.channelId].onAddNewAction(action)
}

const onUndoAction = (socket) => {
    if (!channels[socket.channelId]) {
        console.log('channel not found')
        return
    }
    channels[socket.channelId].onUndoAction()
    socket.emit('on-undo-redo', channels[socket.channelId])
    socket.to(socket.channelId).emit('on-undo-redo', channels[socket.channelId])
}

const onRedoAction = (socket) => {
    if (!channels[socket.channelId]) {
        console.log('channel not found')
        return
    }
    channels[socket.channelId].onRedoAction()
    socket.emit('on-undo-redo', channels[socket.channelId])
    socket.to(socket.channelId).emit('on-undo-redo', channels[socket.channelId])
}

module.exports = { joinChannel, onAddBoardAction, onUserDisconnect, onMouseMove, onUndoAction, onRedoAction }