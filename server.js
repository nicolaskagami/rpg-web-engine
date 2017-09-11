// Using Express
//
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

server.lastUserID = 0;

server.listen(process.env.PORT || 8081,function(){
    console.log('Listening on '+server.address().port);
});

io.on('connection',function(socket)
{
    socket.on('request_new_user',function()
        {
        socket.user = 
        {
            id: server.lastUserID++,
            x: randomInt(100,400),
            y: randomInt(100,400)
        };
        socket.emit('list_users',getAllUsers());
        socket.broadcast.emit('inform_new_user',socket.user);

        socket.on('click',function(data)
        {
            console.log('click to '+data.x+', '+data.y);
            socket.user.x = data.x;
            socket.user.y = data.y;
            io.emit('move',socket.user);
        });

        socket.on('disconnect',function()
        {
            io.emit('remove_user',socket.user.id);
        });
        socket.on('request_text',function(text)
        {
            console.log('Text: '+text);
            io.emit('propagate_text',socket.user.id,text);
        });
    });
});

function getAllUsers(){
    var users = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var user = io.sockets.connected[socketID].user;
        if(user) users.push(user);
    });
    return users;
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
