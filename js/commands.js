const User = require('./user')
const Session = require('./session')
var commands = {}
class Command
{
    constructor(commandName, commandDescriptor)
    {
        commands[commandName] = commandDescriptor 
    }

    static execute({io, socket, cmd, args})
    {
        try{
            if(io && socket && cmd && commands[cmd])
                commands[cmd].method({io:io, socket:socket,cmd:cmd,args:args});
        } catch(e) { 
            socket.emit('command error',e.toString());
        }
    }
    static updateCommands(socket)
    {
        socket.user.commands = Command.getCommandsByStates(socket.user.states);
        socket.emit('command list', socket.user.commands)
    }
    static sendEntTypeArgs(socket,session)
    {
        var args = session.getEntityTypeArgs();
        var types = {}
        for(var i in args)
        {
            var infoName = "entity-"+i+'-args'; 
            socket.emit('info', {infoName: infoName, data: args[i]})
            types[i] = infoName;
        }
        socket.emit('info', {infoName: 'entity-type-args', data: types})
    }
    static getCommandsByStates(states)
    {
        var cmds = {};
        for(var i in commands)
        {
            if(states.includes(commands[i].state))
                cmds[commands[i].command] = commands[i].args;
        }
        return cmds;
    }
}
new Command('login' ,{
    command: '/login',
    state: 'guest',
    args: [], 
    method: function({io, socket, cmd, args}) { 
        var username = args.split(' ')[0];
        var password = args.split(' ')[1]; 
        //Authenticate
        User.deleteUser(socket.user.username)
        socket.user = new User({username: username, socketId: socket.id})
        socket.user.addState('guest');
        socket.user.addState('user');
        Command.updateCommands(socket);

        io.sockets.emit('info', {infoName:'user', data: User.getUsers()});
        socket.emit('login', {username: username});
    }
})
new Command('pm' ,{
    command: '/pm',
    state: 'user',
    args: ['user','message'], 
    method: function({io, socket, cmd, args}) { 
        var receiver = args.split(' ')[0];
        var message = args.split(' ')[1];
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
        socket.emit('info', {infoName: 'user', data: User.getUsers()})
        //socket.emit('user list', {users: User.getUsers()})
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
new Command('list-sessions', {
    command: '/list-sessions',
    state: 'user',
    args: [], 
    method: function({io, socket, cmd, args}) { 
        socket.emit('info', {infoName: 'session', data:Session.getSessions()})
    }
})
new Command('create-session', {
    command: '/create-session',
    state: 'user',
    args: ['name'], 
    method: function({io, socket, cmd, args}) { 
        new Session(args.split(' ')[0], socket.user.username)
        socket.emit('info', {infoName: 'session', data:Session.getSessions()})
    }
})
new Command('enter-session', {
    command: '/enter-session',
    state: 'user',
    args: ['session'], 
    method: function({io, socket, cmd, args}) { 
        var sessionName = args.split(' ')[0];
        var session = Session.getSession(sessionName)
        var username = socket.user.username;
        if(session)
        {
            session.userIn(username);
            socket.session = sessionName;
            socket.join(sessionName);
            socket.user.addState('session');
            if(session.users[username].role == "admin")
                socket.user.addState('session-master');
            Command.updateCommands(socket);
            socket.emit('enter session', sessionName)
            socket.emit('info', {infoName: 'session', data:Session.getSessions()})
            socket.emit('info', {infoName: 'entity-type', data: session.getEntityTypes()})
            Command.sendEntTypeArgs(socket, session);
        }
    }
})
new Command('leave-session', {
    command: '/leave-session',
    state: 'session',
    args: [], 
    method: function({io, socket, cmd, args}) {
        if(socket.session)
        {
            var session = Session.getSession(socket.session)
            if(session)
            {
                session.userOut(socket.username);
                socket.user.rmState('session');
                Command.updateCommands(socket);
                socket.session = '';
                socket.emit('leave session')
            }
        }
    }
})
new Command('list-session-users', {
    command: '/list-session-users',
    state: 'session',
    args: [], 
    method: function({io, socket, cmd, args}) { 
        if(socket.session)
        {
            var session = Session.getSession(socket.session)
            if(session)
                socket.emit('info', {infoName: 'session-user', data:Session.getActiveUsers()})
        }
    }
})
new Command('list-entities', {
    command: '/list-entities',
    state: 'session',
    args: [], 
    method: function({io, socket, cmd, args}) { 
        if(socket.session)
        {
            var session = Session.getSession(socket.session)
            if(session)
                socket.emit('info', {infoName: 'visible-entities', data:Session.getVisibleEntities(socket.user.username)})
        }
    }
})
new Command('list-entity-types', {
    command: '/list-entity-types',
    state: 'session',
    args: [], 
    method: function({io, socket, cmd, args}) { 
        if(socket.session)
        {
            var session = Session.getSession(socket.session)
            if(session)
                socket.emit('info', {infoName: 'entity-type', data: session.getEntityTypes()})
        }
    }
})
new Command('create-entity', {
    command: '/create-entity',
    state: 'session-master',
    args: ['entity-type-args'], 
    method: function({io, socket, cmd, args}) { 
        if(socket.session)
        {
            var entityType = args.split(' ')[0]; 
            var parameters = args.split(' ')[1]; 
            var session = Session.getSession(socket.session)
            if(session && session.users[socket.user.username].role == "admin")
            {
                session.newEntity(entityType, parameters);
                //session.insertVisibleEntities({ username: socket.user.username,entities: [entity]})
            } 
        }
    }
})
//Entgine Commands
//
new Command('list-snapshots', {
    command: '/list-snapshots',
    state: 'session-master',
    args: [], 
    method: function({io, socket, cmd, args}) { 
        if(socket.session)
        {
            var session = Session.getSession(socket.session)
            if(session && session.users[socket.user.username].role == "admin")
            {
                socket.emit('info', {infoName:'snapshot', data: session.listSnapshots()})
            } 
        }
    }
})
//list-snapshot
//load-snapshot
//order-entity
//list-agent-loop
//set-agent-loop
//execute-order
//entgine.step
module.exports = Command;
