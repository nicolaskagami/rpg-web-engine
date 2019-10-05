const User = require('../user')
const Session = require('../session')
const Command = require('../commands');
new Command('list-sessions', {
    command: '/list-sessions',
    state: 'user',
    args: [], 
    method: function({io, socket, cmd, args}) { 
        Command.updateInfo(socket, 'session')
    }
})
new Command('create-session', {
    command: '/create-session',
    state: 'user',
    args: ['name'], 
    method: function({io, socket, cmd, args}) { 
        var session = new Session(args.split(' ')[0], socket.user.username)
        if(session)
            Command.updateGlobalInfo(io, 'session')
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
            // check session password?
            if(!session.users[username])
                session.newUser(username)
            session.userIn(username);
            socket.user.sessionName = sessionName
            socket.session = sessionName;
            socket.join(sessionName);
            socket.user.addState('session');
            if(session.users[username].role == "admin")
                socket.user.addState('session-master');
            Command.updateCommands(socket);
            //socket.emit('enter session', sessionName)
                Command.updateInfo(socket, 'client-session');

            Command.updateGlobalInfo(io, 'session-user')
            Command.updateInfo(socket, 'entity-type-args')
            Command.updateInfo(socket, 'entity-type')
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
                Command.updateInfo(socket, 'client-session');
                Command.updateGlobalInfo(io, 'session-user')
            }
        }
    }
})
new Command('list-session-users', {
    command: '/list-session-users',
    state: 'session',
    args: [], 
    method: function({io, socket, cmd, args}) { 
        Command.updateInfo(socket, 'session-user')
    }
})
new Command('list-entities', {
    command: '/list-entities',
    state: 'session',
    args: [], 
    method: function({io, socket, cmd, args}) { 
        Command.updateInfo(socket, 'visible-entity')
    }
})
new Command('list-entity-types', {
    command: '/list-entity-types',
    state: 'session',
    args: [], 
    method: function({io, socket, cmd, args}) { 
        Command.updateInfo(socket, 'entity-type')
    }
})
new Command('create-entity', {
    command: '/create-entity',
    state: 'session-master',
    args: ['entity-type-args'], 
    method: function({io, socket, cmd, args}) { 
        if(socket.session)
        {
            var argArray = args.split(' ');
            var entityType = argArray.shift();
            var parameters = argArray.join(' ')
            var session = Session.getSession(socket.session)
            if(session && session.users[socket.user.username].role == "admin")
            {
                var entUUID = session.newEntity(entityType, parameters);
                session.insertVisibleEntities({ username: socket.user.username,entities: [entUUID]})
                session.insertCommandedEntities({ username: socket.user.username,entities: [entUUID]})
                socket.emit('message', {username:"new "+entityType,message:entUUID});
                socket.emit('info', {infoName:"answer",data:entUUID});
            } 
        }
    }
})
