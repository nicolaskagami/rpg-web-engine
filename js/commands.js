const User = require('./user')
const Session = require('./session')
const Info = require('./info')
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
            console.log(e)
        }
    }
    static updateCommands(socket)
    {
        socket.user.commands = Command.getCommandsByStates(socket.user.states);
        socket.emit('command list', socket.user.commands)
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
    static updateInfo(socket, infoName)
    {
        var infoFunction = Info.getInfo(infoName);
        if(infoFunction)
            socket.user.info[infoName] = infoFunction(socket)
        Command.sendInfo(socket, infoName)
    }
    static updateGlobalInfo(io, infoName)
    {
        var users = User.getUsers();
        for (var i in users)
        {
            var u = User.getUser(users[i]);
            Command.updateInfo(io.sockets.sockets[u.socketId],infoName)
        }
    }
    static sendInfo(socket, infoName)
    {
        var info = socket.user.info[infoName];
        socket.emit('info', {infoName:infoName, data:info});
    }

}
module.exports = Command;

new Command('request-info', {
    command: '/request-info',
    state: 'debug',
    args: [], 
    method: function({io, socket, cmd, args}) { 
        var infoName = args.split(' ')[0];
        Command.sendInfo(socket, infoName);
    }
})
const entgine_commands = require('./commands/entgine_commands');
const user_commands = require('./commands/user_commands');
const session_commands = require('./commands/session_commands');
