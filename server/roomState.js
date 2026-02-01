const { generateUser } = require("./utils.js")

class Channel {
    channelId = null
    messages = []
    users = []

    whiteBoardActions = []

    undoStack = []

    constructor(channelId, userId) {
        this.channelId = channelId
    }

    onNewUser(userId, username) {
        console.log(username)
        const newUser = generateUser(username)
        newUser.id = userId
        newUser.pos = { x: 0, y: 0 }
        this.users.push(newUser)
        return newUser
    }

    onUserDisconnect(userId) {
        let leftuser = {}
        this.users = this.users.filter(user => {
            if (user.id == userId) {
                leftuser = user
                return false
            }
            return true
        }
        )
        return leftuser
    }

    onMouseMove(userId, pos) {
        this.users = this.users.map(user => {
            if (user.id == userId) {
                user.pos = pos
            }
            return user
        })
    }

    onAddNewAction(action) {
        this.whiteBoardActions.push(action)
        return this.whiteBoardActions
    }

    onUndoAction() {
        if (this.whiteBoardActions.length == 0) return this.whiteBoardActions
        const lastAction = this.whiteBoardActions.pop()
        this.undoStack.push(lastAction)
        return this.whiteBoardActions
    }

    onRedoAction() {
        if (this.undoStack.length == 0) return this.whiteBoardActions
        const lastUndo = this.undoStack.pop()
        this.whiteBoardActions.push(lastUndo)
        return this.whiteBoardActions
    }
}

const channels = {}


module.exports = {
    Channel,
    channels
}