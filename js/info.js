const User = require('./user')
const Session = require('./session')
var infos = {};
class Info
{
    constructor(name,updateFunction)
    {
        infos[name] = updateFunction;
    }
    static getInfo(name)
    {
        return infos[name];
    }
}
new Info('client-login',function(socket) { return socket.user.username })
new Info('client-session',function(socket) { return socket.session })
new Info('user',function(socket) { return User.getUsers(); } ) 
new Info('session',function(socket) { return Session.getSessions(); } ) 
new Info('session-user',function(socket) { 
    var session = Session.getSession(socket.session);
    if(session)
        return session.getActiveUsers();
})
new Info('entity-type',function(socket) { 
    var session = Session.getSession(socket.session);
    return session.getEntityTypes();
} ) 
new Info('visible-entity',function(socket) { 
    if(socket.session)
    {
        var session = Session.getSession(socket.session)
        if(session)
            return session.getVisibleEntities(socket.user.username)
    }
})
new Info('commanded-entity',function(socket) { 
    if(socket.session)
    {
        var session = Session.getSession(socket.session)
        if(session)
            return session.getCommandedEntities(socket.user.username)
    }
})
new Info('entity-type-args',function(socket) { 
    var session = Session.getSession(socket.session);
    var args = session.getEntityTypeArgs();
    var types = {}
    for(var i in args)
    {
        var infoName = "entity-"+i+'-args'; 
        socket.emit('info', {infoName: infoName, data: args[i]})
        types[i] = infoName;
    }
    return types;
})
new Info('snapshot',function(socket) {
    if(socket.session)
    {
        var session = Session.getSession(socket.session)
        if(session && session.users[socket.user.username].role == "admin")
            return session.listSnapshots()
    }
})
new Info('entgine-loop',function(socket) {
    if(socket.session)
    {
        var session = Session.getSession(socket.session)
        if(session && session.users[socket.user.username].role == "admin")
            return session.entgine.getAgentLoop()
    }
})
module.exports = Info;
