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
});

Client.socket.on('propagate_text',function(id,text)
{
   insertChat("me",id+text) ;
});

Client.socket.on('list_users',function(data)
{

    //Functions which depend on current_users
    Client.socket.on('move',function(data)
    {
    });

    Client.socket.on('remove_user',function(id)
    {
    });
});


