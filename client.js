//client.js
var io = require('socket.io-client');
var cli = require('cli');
var socket = io.connect('http://localhost:3000', {reconnect: true});
var readline = require('readline');


var autoComplete = function completer(line) 
{
    const completions = 'var const readline console globalObject'.split(' ');
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

socket.on('connect', ()=> { consoleOut('Connected');});
socket.on("new message", (data) => { consoleOut(data.username+": "+data.message)});
socket.on("command", (data) => { consoleOut(data.username+": "+data.message)});


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  completer: autoComplete
});

rl.setPrompt("> ");
rl.prompt();
rl.on('line', function(line) {
    if (line[0] == "/" && line.length > 1) {
        var cmd = line.match(/[a-z]+\b/)[0];
        var arg = line.substr(cmd.length+2, line.length);
        socket.emit('command',{cmd: cmd, args: arg});
        rl.prompt();
    } else {
        socket.emit('new message', line)
        rl.prompt();
    }
}).on('close',function(){
    process.exit(0);
});
