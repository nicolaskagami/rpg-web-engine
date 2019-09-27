// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var port = process.env.PORT || 3000;
var commands = require('./js/commands')
const User = require('./js/user')
const Session = require('./js/session')

server.listen(port, () => {console.log("Server: UP")});

app.use(express.static(path.join(__dirname, 'public')));

function message({socket,data})
{
    socket.broadcast.emit('message', {username: socket.username,message: data});
}

function removeUser(username)
{
    User.deleteUser(username);
    io.sockets.emit('user list', {users: users});
}
function addUser({socket,username,password})
{
    var user = new User({username: username})
    user.socketId = socket.id;
    socket.username = username;
    io.sockets.emit('user list', {users: User.getUsers()});
    socket.emit('login', {username: username});
    socket.emit('command list', socket.commands);
}

io.on('connection', (socket) => 
{
    socket.username = '';
    socket.session = '';
    socket.commands = '/login /list-users /list-commands /list-sessions /list-session-users /create-session /enter-session /leave-session /pm';

    socket.on('message', (data) => { message({socket:socket,data:data}) });
    socket.on('command', ({cmd, args}) => { commands[cmd].method({io:io, socket:socket,cmd:cmd,args:args})}) 
    socket.on('login', ({username,password}) => { addUser({socket:socket,username:username,password:password})});
    socket.on('disconnect', () => {removeUser(socket.username)});
});
