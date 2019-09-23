// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var port = process.env.PORT || 3000;
var GameEngine = require('./entities/gameEngine');



server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));

var numUsers = 0;
io.on('connection', (socket) => {
  var loggedIn = false;

  socket.on('new message', (data) => {
      console.log("nm")
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });
  socket.on('command', ({cmd, args}) => {
      console.log("cmd")
    socket.broadcast.emit('command', {
      username: socket.username,
      message: "CMD"+cmd+args+args
    });
  });


  socket.on('add user', (username) => {
    if (loggedIn) return;
    socket.username = username;
    ++numUsers;
    loggedIn = true;
    socket.emit('login', {numUsers: numUsers});

    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  socket.on('disconnect', () => {
    if (loggedIn) 
    {
      --numUsers;
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});
