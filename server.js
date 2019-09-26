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

sessions = {};
users = [];

app.use(express.static(path.join(__dirname, 'public')));

function message({socket,data})
{
    socket.broadcast.emit('message', {username: socket.username,message: data});
}
function addSession(sessionName,username)
{
    if(!sessionName || !username || sessions[sessionName]) return;
    this.sessions[sessionName] = new Session(username);
}
function enterSession(sessionName,username)
{
    if(!sessionName || !username || !sessions[sessionName]) return false;
    this.sessions[sessionName].userIn(username);
    return true;
}
function leaveSession(sessionName,username)
{
    if(!sessionName || !username || !sessions[sessionName]) return;
    this.sessions[sessionName].userOut(username);
}
function listSessionUsers(sessionName)
{
    if(!sessionName || !sessions[sessionName]) return;
    console.log( this.sessions[sessionName].getActiveUsers());
    return this.sessions[sessionName].getActiveUsers();
}
function getSessionList()
{
    var sessionList = [];
    for(var i in sessions)
        sessionList.push(i);
    return sessionList;
}


function handleCommand({socket,cmd,args})
{
    var argv = args.split(' ')
    switch(cmd)
    {
        case 'list-users': socket.emit('user list', {users: users}); break;

        case 'list-commands': socket.emit('command list', socket.commands); break;

        case 'create-session': addSession(argv[0],socket.username)
        case 'list-sessions': socket.emit('session list', {sessions: getSessionList()}); break;

        case 'enter-session': 
            if(enterSession(argv[0],socket.username)) 
            {
                socket.session = argv[0]; 
                socket.join(argv[0]); 
            } else break;
        case 'list-session-users': socket.emit('session user list', listSessionUsers(socket.session)) ; break;

        case 'leave-session': 
            socket.leave(socket.session); 
            socket.session = '';
            

    }
    console.log("Command: "+cmd)
    console.log("Args: "+args)
}
function removeUser(username)
{
    var index = users.indexOf(username)
    if (index == -1) return
    users.splice(index,1)
    io.sockets.emit('user list', {users: users});
}
function addUser({socket,username,password})
{
    if (socket.username) return; 
    //Authenticate 
    socket.username = username;
    users.push(username)
    io.sockets.emit('user list', {users: users});
    socket.emit('login', {username: username});
    socket.emit('command list', socket.commands);
}

io.on('connection', (socket) => 
{
    socket.username = '';
    socket.session = '';
    socket.commands = '/login /list-users /list-commands /list-sessions /list-session-users /create-session /enter-session /leave-session';

    socket.on('message', (data) => { message({socket:socket,data:data}) });
    socket.on('command', ({cmd, args}) => { handleCommand({socket:socket,cmd:cmd,args:args}) });
    socket.on('login', ({username,password}) => { addUser({socket:socket,username:username,password:password})});
    socket.on('disconnect', () => {removeUser(socket.username)});
});
