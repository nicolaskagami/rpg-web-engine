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
                socket.emit('info', {infoName:'snapshot', data: session.listSnapshots()})
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
            {
                session.entgine.undo();
            } 
        }
    }
})
new Command('order-entity', {
    command: '/order-entity',
    state: 'session-master',
    args: ['commanded-entity'], 
    method: function({io, socket, cmd, args}) { 
        if(socket.session)
        {
            var session = Session.getSession(socket.session)
            var argArray = args.split(' ');
            var ent = argArray.shift();
            var order = argArray.join(' ')
            if(session && session.users[socket.user.username].role == "admin")
            {
                session.orderEntity(ent,order,socket.user.username )
            } 
        }
    }
})