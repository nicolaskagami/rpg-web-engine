const User = require('../user')
const Session = require('../session')
const Command = require('../commands');
new Command('login' ,{
    command: '/login',
    state: 'guest',
    args: [], 
    method: function({io, socket, cmd, args}) { 
        var username = args.split(' ')[0];
        var password = args.split(' ')[1]; 
        //Authenticate
        User.deleteUser(socket.user.username) // Remove Guest User
        socket.user = new User({username: username, socketId: socket.id})
        socket.user.addState('guest');
        socket.user.addState('user');
        Command.updateCommands(socket);
        Command.updateGlobalInfo(io,'user');
        Command.updateInfo(socket, 'client-login');
//        socket.emit('login', {username: username});
    }
})
new Command('pm' ,{
    command: '/pm',
    state: 'user',
    args: ['user','message'], 
    method: function({io, socket, cmd, args}) { 
        var argArray = args.split(' ');
        var receiver = argArray.shift();
        var message = argArray.join(' ')
        var user = User.getUser(receiver)
        if(!user) return;
        io.sockets.sockets[user.socketId].emit("private message", {from: socket.user.username, to: receiver, message: message})
        socket.emit("private message", {from: socket.user.username, to: receiver, message: message})
    }
})
new Command('list-users', {
    command: '/list-users',
    state: 'guest',
    args: [], 
    method: function({io, socket, cmd, args}) { 
        Command.updateInfo(socket, 'user')
    }
})
new Command('list-commands', {
    command: '/list-commands',
    state: 'guest',
    args: [], 
    method: function({io, socket, cmd, args}) { 
        socket.emit('command list', socket.user.commands)
    }
})
