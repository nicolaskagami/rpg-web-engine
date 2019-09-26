//client.js
const io = require('socket.io-client');
var processArgs = process.argv.slice(2);
var ip = (processArgs.length > 0) ? processArgs[0] : 'localhost'
var port = (processArgs.length > 1) ? processArgs[1] : '80'
const socket = io.connect('http://'+ip+':'+port, {reconnect: true});
const readline = require('readline');

var autoComplete = function completer(line) 
{
    const completions = '/login /listUsers'.split(' ');
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

socket.on('connect', ()=> { consoleOut('Connected to '+ip+':'+port);});
socket.on("message", (data) => { consoleOut(data.username+": "+data.message)});
socket.on("command", (data) => { consoleOut(data.username+": "+data.message)});
socket.on("user list", (data) => { consoleOut(data.users)});
socket.on("login", (data) => { login = data.username; resetPrompt()});

rl.setPrompt("> ");
rl.prompt();
