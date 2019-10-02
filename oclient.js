const io = require('socket.io-client');
var processArgs = process.argv.slice(2);
var ip = (processArgs.length > 0) ? processArgs[0] : 'localhost'
var port = (processArgs.length > 1) ? processArgs[1] : '80'
const socket = io.connect('http://'+ip+':'+port, {reconnect: true});
const readline = require('readline');
const colors = require('./js/colors');


var commands = { '/login': {},
  '/create-entity': { type: 'entity-type', literal: {'default': {type: 'create-entity-default-args'}, 'Grid': {type: 'grid-arguments'}}}, 
  '/assign-type': { type: 'entity-type', literal: {'default': { type: 'user'}}}
}
var info = {
    'entity-type': [ 'Grid', 'Entity'],
    'grid-arguments': ['--grid', '--object'],
    'user': [ 'Alice', 'Bob']
}
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
        var pointer = commands[command]
        for(var i in lineWords)
        {
            var word = lineWords[i];
            if(pointer.literal)
            {
                if(pointer.literal[word])
                    pointer = pointer.literal[word];
                else
                    pointer = pointer.literal['default'];
            }
        }
        if(info[pointer.type])
            completions = info[pointer.type]
    }
    const hits = completions.filter((c) => c.startsWith(lastWord));
    return [hits, lastWord];
}

function consoleOut(msg) 
{
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.log(msg);
    rl.prompt(true);
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    completer: autoComplete
});

function resetPrompt()
{
    consoleOut(commands)
    var promptLine = '';
    if(login)
        promptLine+=colors.FgBlue+login+colors.Reset+'@'+colors.FgGreen+ip+colors.Reset
    if(session)
        promptLine+=':'+colors.FgYellow+session+colors.Reset;
    rl.setPrompt(promptLine+' > ');
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

rl.on('line', function(line) {
    if (line[0] == "/" && line.length > 1) {
        var cmd = line.match(/[a-z-]+\b/)[0];
        var arg = line.substr(cmd.length+2, line.length);
        if(cmd == "login")
            requestPassword(arg)
        else
            socket.emit('command',{cmd: cmd, args: arg});
        rl.prompt();
    } else {
        socket.emit('message', line)
        rl.prompt();
    }
}).on('close',function(){
    process.exit(0);
});
var login = '';
var session ='';
serverHandle = colors.FgGreen+"Server"

socket.on('connect', ()=> { consoleOut(serverHandle+': '+colors.Reset+'Connected to '+ip+':'+port);});
socket.on('disconnect', ()=> { consoleOut(serverHandle+': '+colors.Reset+'Lost connection to '+ip+':'+port);});
socket.on("message", (data) => { consoleOut(data.username+": "+data.message)});
socket.on("private message", ({from, to,message}) => { consoleOut(from+to+':'+message)})
socket.on("command", (data) => { consoleOut(data.username+": "+data.message)});
socket.on("command list", (data) => { commands = data });
socket.on("session user list", (data) => { consoleOut(data) });
socket.on("enter session", (data) => { session = data; resetPrompt(); });
socket.on("leave session", (data) => { session = ''; resetPrompt();});
socket.on("login", (data) => { login = data.username; resetPrompt()});
socket.on("info", ({infoName,data}) => { info[infoName] = data});

rl.setPrompt("> ");
rl.prompt();
