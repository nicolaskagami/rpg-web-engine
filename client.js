const io = require('socket.io-client');
const fs = require('fs')
var processArgs = process.argv.slice(2);
var ip = (processArgs.length > 0) ? processArgs[0] : 'localhost'
var port = (processArgs.length > 1) ? processArgs[1] : '80'
const socket = io.connect('http://'+ip+':'+port, {reconnect: true});
const readline = require('readline');
const colors = require('./js/colors');

function isArray(what) {
    return Object.prototype.toString.call(what) === '[object Array]';
}

var commands = { }
var info = {}
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
var vars = {}
function command(line)
{
    if (line[0] == "/" && line.length > 1) {
        var cmd = line.match(/[a-zA-Z0-9-]+\b/)[0];
        var arg = line.substr(cmd.length+2, line.length);
        if(cmd == "login")
            requestPassword(arg)
        else
            socket.emit('command',{cmd: cmd, args: arg});
        rl.prompt();
    } else if (line[0] == "$" && line.length > 1) {
        if(line.match(/^\$[a-zA-Z0-9]+\ *=\ *\/.*$/))
        {
            var target = line.match(/^\$([a-zA-Z0-9]+)\ *=.*$/)[1]
            var cmdLine = line.match(/^\$[a-zA-Z0-9]+\ *=\ *(\/.*)$/)[1]
            var cmd = cmdLine.match(/[a-zA-Z0-9-]+\b/)[0];
            var arg = cmdLine.substr(cmd.length+2, cmdLine.length);
            socket.emit('command',{cmd: cmd, args: arg});
            socket.once("info", ({infoName,data}) => { vars[target] = JSON.parse(JSON.stringify(data));rl.prompt()})
        } else if(line.match(/^\$[a-zA-Z0-9]+\ *=\ *\$[a-zA-Z0-9]+\ *$/)){ 

            var target = line.match(/^\$([a-zA-Z0-9]+)\ *=\ *\$[a-zA-Z0-9]+\ *$/)[1]
            var source = line.match(/^\$[a-zA-Z0-9]+\ *=\ *\$([a-zA-Z0-9]+)\ *$/)[1]
            if(vars[source])
            {
                vars[target] = vars[source];
            }
        rl.prompt();
        }

    } else {
        var regex = /\$([a-zA-Z0-9]+)/g;
        line = line.replace(regex, (match)=> { 
            match = match.substr(1);
            return (vars[match]) ? JSON.stringify(vars[match]) : '$'+match;
        })
        socket.emit('message', line)
        rl.prompt();
    }
}
function evalLocalVars(line)
{
    var regex = /\$([a-zA-Z0-9]+)/g;
    var match;
    do{
    } while(match)
}
rl.on('line', function(line) {
    if (line[0] == "<" && line.length > 1) {
        var file = line.match(/[a-zA-Z0-9.]+\b/)[0];
        const readInterface = readline.createInterface({
            input: fs.createReadStream(file,'utf-8'),
            output: process.stdout,
            console: false
        });
        readInterface.on('line', function(line) {
            command(line);
        });

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
    resetPrompt();
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
    resetPrompt();
}
socket.on('connect', ()=> { serverMessage("Connected") });
socket.on('disconnect', ()=> { serverMessage("Disconnected") });
socket.on("message", ({username, message}) => { userMessage(username, message) }); 
socket.on("private message", ({from, to, message}) => { privateMessage(from, message) }); 
socket.on("command list", (data) => { commands = data });
socket.on("info", ({infoName,data}) => {info[infoName] = data;  infoMessage(infoName,data); });
socket.on('command error', (data) => { errorMessage(data) });

resetPrompt();
