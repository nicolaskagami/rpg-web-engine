const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const port = process.env.PORT || 3000;
const Command = require('./js/commands')
const User = require('./js/user')

server.listen(port, () => {console.log("Server: UP")});

app.use(express.static(path.join(__dirname, 'public')));

function message({socket,data})
{
    socket.broadcast.emit('message', {username: socket.user.username, message: data});
}

function removeUser(username)
{
    User.deleteUser(username);
    io.sockets.emit('user list', {users: User.getUsers()});
}
function addGuest({socket})
{
    socket.user = new User({username: 'guest'+guestId++, socketId: socket.id});
    socket.user.addState('guest');
    Command.updateCommands(socket);
    io.sockets.emit('user list', {users: User.getUsers()});
}

var guestId = 0;
io.on('connection', (socket) => 
{
    addGuest({socket:socket});
    Command.updateInfo(socket,'client-login');

    socket.on('message', (data) => { message({ socket:socket, data:data}) });
    socket.on('command', ({cmd, args}) => { Command.execute({io:io, socket:socket, cmd: cmd, args: args}) })
    socket.on('disconnect', () => {removeUser(socket.user.username)});
});
