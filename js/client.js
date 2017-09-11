var Client = {};
Client.socket = io.connect();

//Send functions:
Client.sendTest = function()
{
    console.log("test sent");
    Client.socket.emit('test');
};

Client.sendNewUser = function()
{
    Client.socket.emit('request_new_user');
};

Client.sendText = function(text)
{
    Client.socket.emit('request_text',text);
};

Client.sendClick = function(x,y)
{
  Client.socket.emit('click',{x:x,y:y});
};

//Receive functions:

Client.socket.on('inform_new_user',function(data)
{
    Game.addNewUser(data.id,data.x,data.y);
});

Client.socket.on('propagate_text',function(id,text)
{
   insertChat("me",id+text) ;
});

Client.socket.on('list_users',function(data)
{
    for(var i = 0; i < data.length; i++)
    {
        Game.addNewUser(data[i].id,data[i].x,data[i].y);
    }

    //Functions which depend on current_users
    Client.socket.on('move',function(data)
    {
        Game.moveUser(data.id,data.x,data.y);
    });

    Client.socket.on('remove_user',function(id)
    {
        Game.removeUser(id);
    });
});


