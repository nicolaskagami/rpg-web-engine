const io = require('socket.io-client');
const fs = require('fs')
const uuidv4 = require('uuid/v4');
var processArgs = process.argv.slice(2);
var ip = (processArgs.length > 0) ? processArgs[0] : 'localhost'
var port = (processArgs.length > 1) ? processArgs[1] : '80'
const socket = io.connect('http://'+ip+':'+port, {reconnect: true});
const readline = require('readline');
const colors = require('./js/colors');

function isArray(what) {
    return Object.prototype.toString.call(what) === '[object Array]';
}
var bufferedInput = []
var commands = { }
var info = {}
var vars = {}

var autoComplete = function completer(line) 
{
    var completions = [];
    const lineWords = line.split(' ');
    const lastWord = lineWords[lineWords.length-1];
    var command = lineWords.shift();

    if(lineWords.length == 0)
    {
        completions = Object.keys(commands)
    } else {
        lineWords.pop();
        var argTypes = commands[command]
        if(argTypes)
        {
            var pointer = argTypes[0];
            var argIndex = 0; 
            for(var i in lineWords)
            {
                var word = lineWords[i];
                if(isArray(info[pointer]))
                {
                    argIndex++;
                    if(argTypes[argIndex])
                        pointer = argTypes[argIndex]
                    else
                        break;
                }else if(info[pointer] && info[pointer][word])
                        pointer = info[pointer][word]
            }
            if(pointer == null || !info[pointer])
                completions = []
            else if(isArray(info[pointer]))
                completions = info[pointer];
            else
                completions = Object.keys(info[pointer])
        }
    }
    const hits = completions.filter((c) => c.startsWith(lastWord));
    return [hits, lastWord];
}

function consoleOut(msg) 
{
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.log(msg);
    resetPrompt()
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    completer: autoComplete
});

function resetPrompt()
{
    var promptLine = '';
    if(info['client-login'])
        promptLine+=colors.FgGreen+info['client-login']+'@'+ip
    if(info['client-session'])
        promptLine+=':'+colors.FgYellow+info['client-session']
    rl.setPrompt(promptLine+colors.Reset+' > ');
    rl.prompt(true)
}

function requestPassword(args)
{
    var username = args.split(' ')[0]
    rl.stdoutMuted = true;
    rl.query = "Password : ";
    rl.question(rl.query, function(password) {
        socket.emit('command',{cmd: 'login', args: username+' '+password});
        rl.history = rl.history.slice(1);
        rl.stdoutMuted = false;
        rl.prompt()
    });

    rl._writeToOutput = function _writeToOutput(stringToWrite) {
    if (rl.stdoutMuted)
        rl.output.write("\x1B[2K\x1B[200D"+rl.query)
    else
        rl.output.write(stringToWrite);
    };
}
function command(line)
{
    if (line[0] == "/" && line.length > 1) {//Command
        line = evalLocalVars(line)
        var cmd = line.match(/[a-zA-Z0-9-]+\b/)[0];
        var arg = line.substr(cmd.length+2, line.length);
        if(cmd == "login")
            requestPassword(arg)
        else
            socket.emit('command',{cmd: cmd, args: arg});
        nextLine()
    } else if (line[0] == "$" && line.length > 1) {
        if(line.match(/^\$[a-zA-Z0-9]+\ *=\ *\/.*$/)) { //Cmd to var
            var target = line.match(/^\$([a-zA-Z0-9]+)\ *=.*$/)[1]
            var cmdLine = line.match(/^\$[a-zA-Z0-9]+\ *=\ *(\/.*)$/)[1]
            cmdLine = evalLocalVars(cmdLine)
            var cmd = cmdLine.match(/[a-zA-Z0-9-]+\b/)[0];
            var arg = cmdLine.substr(cmd.length+2, cmdLine.length);
            var cmdId = uuidv4();
            rl.pause();
            socket.emit('command',{cmd: cmd, args: arg, cmdId: cmdId});
            socket.once(cmdId, (data) => { 
                vars[target] = JSON.parse(JSON.stringify(data));
                nextLine()
            })
        } else if(line.match(/^\$[a-zA-Z0-9]+\ *=\ *\$[a-zA-Z0-9]+\ *$/)){ //Var to var
            var target = line.match(/^\$([a-zA-Z0-9]+)\ *=\ *\$[a-zA-Z0-9]+\ *$/)[1]
            var source = line.match(/^\$[a-zA-Z0-9]+\ *=\ *\$([a-zA-Z0-9]+)\ *$/)[1]
            if(vars[source])
                vars[target] = JSON.parse(JSON.stringify(vars[source]));
            nextLine()
        }

    } else {
        line = evalLocalVars(line)
        socket.emit('message', line)
        nextLine()
    }
}
function evalLocalVars(line)
{
    var regex = /\$([a-zA-Z0-9]+)/g;
    return line.replace(regex, (match)=> {
        match = match.substr(1);
        return (vars[match]) ? vars[match] : '$'+match;
    })
}
function nextLine()
{
    if(bufferedInput.length>0)
        command(bufferedInput.shift())
    rl.prompt()
}
rl.on('line', function(line) {
    if (line[0] == "<" && line.length > 1) {
        var file = line.match(/[a-zA-Z0-9.]+\b/)[0];
        var readInterface = readline.createInterface({
            input: fs.createReadStream(file,'utf-8')
        });
        readInterface.on('line', function(line) { bufferedInput.push(line)});
        readInterface.on('close', function(line) { nextLine()});

    } else {
        command(line);
    }

})
rl.on('SIGINT', () => { 
    rl.clearLine(process.stdin);
    resetPrompt();
})
rl.on('close',function(){ process.exit(0); });
function serverMessage(line)
{
    var serverHandle = colors.FgGreen+ip+':'+port+": "
    consoleOut(serverHandle+line)
}
function userMessage(username, msg)
{
    var userHandle= colors.FgBlue+username+": "
    consoleOut(userHandle+msg)
}
function privateMessage(username, msg)
{
    var userHandle= colors.FgMagenta+username+": "
    consoleOut(userHandle+msg)
}
function errorMessage(error)
{
    var errorHandle= colors.FgRed
    consoleOut(errorHandle+error)
}
function infoMessage(name, data)
{
    var infoHandle= colors.FgYellow+name+": "
    consoleOut(infoHandle+data)
}
socket.on('connect', ()=> { serverMessage("Connected") });
socket.on('disconnect', ()=> { serverMessage("Disconnected") });
socket.on("message", ({username, message}) => { userMessage(username, message) }); 
socket.on("private message", ({from, to, message}) => { privateMessage(from, message) }); 
socket.on("command list", (data) => { commands = data });
socket.on("info", ({infoName,data}) => {info[infoName] = data;  infoMessage(infoName,data); });
socket.on('command error', (data) => { errorMessage(data) });

resetPrompt();
