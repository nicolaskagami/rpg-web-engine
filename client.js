//client.js
var io = require('socket.io-client');
var socket = io.connect('http://localhost:3000', {reconnect: true});

// Add a connect listener
socket.on('connect', ()=> {
    console.log('Connected!');
    socket.emit('add user', "123");
});
    socket.on("new message", (data) => {
        console.log(data.username+": "+data.message)});

