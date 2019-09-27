var users = {}
class User 
{
    constructor({object, username, socketId})
    {
        if(!username || ! socketId)
            throw new Error("Invalid new User")
        if (object != null)
        {
            for (const key of Object.keys(object)) 
                this[key] = object[key];
        } else {
            this.username = username;
            this.states = [];
            this.commands = [];
            this.socketId = socketId;
        }
        users[username] = this;
    }
    addState(state)
    {
        if(!this.states.includes(state))
            this.states.push(state)
    }
    rmState(state)
    {
        var index = this.states.indexOf(state)
        if (index > -1) 
            this.states.splice(index, 1);
    }

    static getUser(username)
    {
        return users[username];
    }
    static deleteUser(username)
    {
        if(users[username])
            delete users[username];
    }
    static getUsers()
    {
        var userList = [];
        for(var i in users)
            userList.push(i);
        return userList;
    }
    //Files owned?
    //Dynamic available Commands?

}
module.exports = User;
