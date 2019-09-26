//client.js
const io = require('socket.io-client');
var processArgs = process.argv.slice(2);
var ip = (processArgs.length > 0) ? processArgs[0] : 'localhost'
var port = (processArgs.length > 1) ? processArgs[1] : '80'
const socket = io.connect('http://'+ip+':'+port, {reconnect: true});
const readline = require('readline');


var commands = '/login';
var autoComplete = function completer(line) 
{
    const completions = commands.split(' ');
    const lineWords = line.split(' ');
    const lastWord = lineWords[lineWords.length-1];
    const hits = completions.filter((c) => c.startsWith(lastWord));
    return [hits.length ? hits : completions, lastWord];
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
    var promptLine = '';
    if(login)
        promptLine+=login+'@'+ip
    if(session)
        promptLine+=session;
    rl.setPrompt(promptLine+' > ');
}

function requestPassword(args)
{
    var username = args.split(' ').splice(-1);
    rl.stdoutMuted = true;
    rl.query = "Password : ";
    rl.question(rl.query, function(password) {
        socket.emit('login',{username:username,password:password});
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
        var cmd = line.match(/[a-z]+\b/)[0];
        var arg = line.substr(cmd.length+2, line.length);
        if(cmd == "login")
        {
            requestPassword(arg)
        }
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
Reset = "\x1b[0m"
Bright = "\x1b[1m"
Dim = "\x1b[2m"
Underscore = "\x1b[4m"
Blink = "\x1b[5m"
Reverse = "\x1b[7m"
Hidden = "\x1b[8m"

FgBlack = "\x1b[30m"
FgRed = "\x1b[31m"
FgGreen = "\x1b[32m"
FgYellow = "\x1b[33m"
FgBlue = "\x1b[34m"
FgMagenta = "\x1b[35m"
FgCyan = "\x1b[36m"
FgWhite = "\x1b[37m"

BgBlack = "\x1b[40m"
BgRed = "\x1b[41m"
BgGreen = "\x1b[42m"
BgYellow = "\x1b[43m"
BgBlue = "\x1b[44m"
BgMagenta = "\x1b[45m"
BgCyan = "\x1b[46m"
BgWhite = "\x1b[47m"
serverHandle = FgGreen+"Server"

socket.on('connect', ()=> { consoleOut(serverHandle+': '+Reset+'Connected to '+ip+':'+port);});
socket.on('disconnect', ()=> { consoleOut(serverHandle+': '+Reset+'Lost connection to '+ip+':'+port);});
socket.on("message", (data) => { consoleOut(data.username+": "+data.message)});
socket.on("command", (data) => { consoleOut(data.username+": "+data.message)});
socket.on("command list", (data) => { commands = data });
socket.on("user list", (data) => { consoleOut(data.users)});
socket.on("login", (data) => { login = data.username; resetPrompt()});

rl.setPrompt("> ");
rl.prompt();
