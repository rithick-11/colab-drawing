const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const dotenv =  require('dotenv')

dotenv.config()

const PORT = process.env.PORT || 3211

const app = express()

let messages = []

app.use(cors())

const server = http.createServer(app)
const io = new Server(server, {
    cors:{
        origin:"*",
        methods:["GET","POST"]
    }
})

app.get("/", (req, res) => {
    console.log('working')
    return res.send("server running at goot conditions")
})


//socket logics

io.on('connect', (socket) => {
    console.log(`connection sucessfull cId:${socket.id}`)

    socket.on('join-channel', (channelId) =>{
        socket.join(channelId)
        socket.emit('previous-messages', messages)
        console.log(`previous messages sent to `, messages)
        console.log(`socket joined channel: ${channelId}`)
        console.log(`socket joined channel`)
    })

    socket.on('send-message', ({channelId, message}) => {
        console.log(`message received at server: ${message} for channel: ${channelId}`)
        messages.push(message)
        io.to(channelId).emit('receive-message', message)
    })

    

    socket.on('disconnect', () => {
        console.log(`socket disconnected cId:${socket.id}`)
    })

})


server.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`)
})