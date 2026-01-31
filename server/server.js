const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const dotenv = require('dotenv')
const { joinChannel, onUserDisconnect, onMouseMove } = require('./rooms')

dotenv.config()

const PORT = process.env.PORT || 3211

const app = express()

let messages = []

app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

app.get("/", (req, res) => {
    console.log('working')
    return res.send("server running at goot conditions")
})


//socket logics

io.on('connect', (socket) => {
    console.log(`connection sucessfull cId:${socket.id}`)

    socket.on('join-channel', (channelId) => {
        joinChannel(socket, channelId,)
    })

    socket.on('send-message', ({ channelId, message }) => {
        console.log(`message received at server: ${message} for channel: ${channelId}`)
        messages.push(message)
        io.to(channelId).emit('receive-message', message)
    })

    socket.on('mouse_move', ({ channelId, pos, id }) => {
        onMouseMove(socket, pos)
    })


    socket.on("start_drawing", ({ channelId, ...storck }) => {
        socket.to(channelId).emit("someone_drawing", storck)
    })


    socket.on('disconnect', () => {
        console.log(`socket disconnected cId:${socket.id}`)
        onUserDisconnect(socket)
    })

})


server.listen(PORT, '0.0.0.0', () => {
    console.log(`server running at http://localhost:${PORT}`)
})