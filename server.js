const express = require('express')
const http = require('http')

const app = express()
const server = http.Server(app)
const io = require('socket.io')(server);

app.use(express.static('public'))
app.use(express.json({ limit: '1mb' }))
var users = [];

const port = process.env.PORT || 3000
server.listen(port, () => { console.log(`Server liten on ${port}`); })

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

io.on("connection", (socket) => {
    var name = "";

    socket.on("connected", (username) => {
        name = username;
        users.push(username)
        io.emit("connected", { userName: name, users: users });
    })

    socket.on("disconnect", () => {
        users.splice(users.indexOf(name), 1)
        io.emit("disconnected", { userName: name, users: users })
    })

    socket.on("new message", (message) => {
        io.emit("new message", message, name)
    })
});