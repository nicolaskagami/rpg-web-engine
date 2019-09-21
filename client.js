//client.js
var io = require('socket.io-client');
var socket = io.connect('http://localhost:3000', {reconnect: true});

// Add a connect listener
socket.on('connect', ()=> {
    console.log('Connected!');
    socket.emit('add user', "123");
    socket.emit("new message", "123")
});
socket.on("new message", (data) => {
    console.log(data.username+": "+data.message)});

var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);
rl.setPrompt('> ');
rl.prompt();
rl.on('line', function(line) {
    socket.emit("new message", line)
    rl.prompt();
}).on('close',function(){
    process.exit(0);
});
