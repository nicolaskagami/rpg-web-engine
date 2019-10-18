const User = require('../user')
const Session = require('../session')
const Command = require('../commands');
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
                Command.updateInfo(socket, 'snapshot');
            } 
        }
    }
})
new Command('load-snapshots', {
    command: '/load-snapshots',
    state: 'session-master',
    args: ['snapshot-uuid'], 
    method: function({io, socket, cmd, args}) { 
        if(socket.session)
        {
            var session = Session.getSession(socket.session)
            var uuid = args.split(' ')[0];
            if(session && session.users[socket.user.username].role == "admin")
            {
                session.entgine.recoverSnapshot(uuid);
            } 
        }
    }
})
new Command('entgine-undo', {
    command: '/entgine-undo',
    state: 'session-master',
    args: [], 
    method: function({io, socket, cmd, args}) { 
        if(socket.session)
        {
            var session = Session.getSession(socket.session)
            var uuid = args.split(' ')[0];
            if(session && session.users[socket.user.username].role == "admin")
                session.entgine.undo();
        }
    }
})
new Command('entgine-step', {
    command: '/entgine-step',
    state: 'session-master',
    args: [], 
    method: function({io, socket, cmd, args}) { 
        if(socket.session)
        {
            var session = Session.getSession(socket.session)
            var uuid = args.split(' ')[0];
            if(session && session.users[socket.user.username].role == "admin")
                session.entgine.nextOrder();
        }
    }
})
new Command('entgine-loop', {
    command: '/entgine-loop',
    state: 'session-master',
    args: [], 
    method: function({io, socket, cmd, args}) { 
        if(socket.session)
        {
            var session = Session.getSession(socket.session)
            if(session && session.users[socket.user.username].role == "admin")
                Command.updateInfo(socket, 'entgine-loop')
        }
    }
})
new Command('entgine-loop-set', {
    command: '/entgine-loop-set',
    state: 'session-master',
    args: [], 
    method: function({io, socket, cmd, args}) { 
        if(socket.session)
        {
            var session = Session.getSession(socket.session)
            if(session && session.users[socket.user.username].role == "admin")
            {
                session.setAgentLoop(args)
                Command.updateInfo(socket, 'entgine-loop')
            }
        }
    }
})
new Command('order-entity', {
    command: '/order-entity',
    state: 'session',
    args: ['commanded-entity'], 
    method: function({io, socket, cmd, args}) { 
        if(socket.session)
        {
            var session = Session.getSession(socket.session)
            var argArray = args.split(' ');
            var ent = argArray.shift();
            var order = argArray.join(' ')
            if(session)
                session.orderEntity(ent,order,socket.user.username )
        }
    }
})
new Command('execute', {
    command: '/execute',
    state: 'session-master',
    args: [], 
    method: function({io, socket, cmd, args}) { 
        if(socket.session)
        {
            var session = Session.getSession(socket.session)
            if(session && session.users[socket.user.username].role == "admin")
            {
                var result = session.entgine.execute(args)
                socket.emit('message', {username:"Result",message:result});
                return result;
            } 
        }
    }
})
new Command('entity-edit', {
    command: '/entity-edit',
    state: 'session-master',
    args: [], 
    method: function({io, socket, cmd, args}) { 
        if(socket.session)
        {
            var session = Session.getSession(socket.session)
            var argArray = args.split(' ');
            var ent = argArray.shift();
            var attr = argArray.shift();
            var result = argArray.join(' ')
            if(session && session.users[socket.user.username].role == "admin")
            {
                session.entgine.edit({entity:ent,attribute:attr,result:result})
            } 
        }
    }
})
