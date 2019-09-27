const User = require('./user')
const Session = require('./session')
var commands = {}

commands['pm'] = {
    command: 'pm',
    state: 'base',
    args: ['user','message'], 
    method: function({io, socket, cmd, args}) { 
        var receiver = args.split(' ')[0];
        var message = args.split(' ')[1];
        var user = User.getUser(receiver)
        if(!user) return;
        io.sockets.sockets[user.socketId].emit("private message", {from: socket.username, to: receiver, message: message})
        socket.emit("private message", {from: socket.username, to: receiver, message: message})
    }
}
commands['list-users'] = {
    command: 'list-users',
    state: 'base',
    args: [], 
    method: function({io, socket, cmd, args}) { socket.emit('user list', {users: getUsers()})}
}
commands['list-commands'] = {
    command: 'list-commands',
    state: 'base',
    args: [], 
    method: function({io, socket, cmd, args}) { socket.emit('command list', socket.commands)}
}
commands['list-sessions'] = {
    command: 'list-sessions',
    state: 'base',
    args: [], 
    method: function({io, socket, cmd, args}) { socket.emit('session list', {sessions: Session.getSessions()})}
}
commands['create-session'] = {
    command: 'create-session',
    state: 'base',
    args: ['name'], 
    method: function({io, socket, cmd, args}) { new Session(args.split(' ')[0], socket.username)}
}
commands['enter-session'] = {
    command: 'enter-session',
    state: 'base',
    args: ['session'], 
    method: function({io, socket, cmd, args}) { 
        var sessionName = args.split(' ')[0];
        var session = Session.getSession(sessionName)
        if(session)
        {
            session.userIn(socket.username);
            socket.session = sessionName;
            socket.join(sessionName);
        }
    }
}
commands['leave-session'] = {
    command: 'leave-session',
    state: 'session',
    args: [], 
    method: function({io, socket, cmd, args}) {
        if(socket.session)
        {
            var session = Session.getSession(socket.session)
            if(session)
            {
                session.userOut(socket.username)
                socket.session = '';
            }
        }
    }
}
commands['list-session-users'] = {
    command: 'list-session-users',
    state: 'session',
    args: [], 
    method: function({io, socket, cmd, args}) { 
        if(socket.session)
        {
            var session = Session.getSession(socket.session)
            if(session)
                socket.emit('session user list', session.getActiveUsers())
        }
        
    }
}

module.exports = commands;
