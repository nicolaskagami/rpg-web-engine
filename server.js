// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var port = process.env.PORT || 3000;

const Session = require('./js/session')
//User commands:
//  List Sessions
//  Create Session
//  Enter Session
//  Session.loadSave (admin only?)
//  Session.broadcast
//  Session.getVisibleEntities
//  Session.getCommandedEntities
//  Session.entity.order


server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

sessions = [];
users = [];

// Routing
app.use(express.static(path.join(__dirname, 'public')));

function message({socket,data})
{
    socket.broadcast.emit('message', {username: socket.username,message: data});
}

function handleCommand({socket,cmd,args})
{
    console.log("Command: "+cmd)
    console.log("Args: "+args)
}
var numUsers = 0;
io.on('connection', (socket) => {
    
    socket.username = '';
    socket.session = '';

    socket.on('message', (data) => { message({socket:socket,data:data}) });
    socket.on('command', ({cmd, args}) => { handleCommand({socket:socket,cmd:cmd,args:args}) });

    socket.on('login', ({username,password}) => {
        if (socket.username) 
            return;
        //Authenticate 
        socket.username = username;
        socket.emit('login', {username: username});
        users.push(username)
        socket.broadcast.emit('user list', {users: users});
        socket.emit('user list', {users: users});
        socket.emit('command list', "/login /test");
    });

    socket.on('disconnect', () => {
        var index = users.indexOf(socket.username)
        if (index == -1)
            return
        users.splice(index,1)
        socket.broadcast.emit('user list', {users: users});
    });
});
