var users = {}
class User 
{
    constructor({object, username})
    {
        if (object != null)
        {
            //Loading from JSON. Every property is loaded.
            for (const key of Object.keys(object)) 
                this[key] = object[key];

        } else {
            this.username = username;
            this.state = 'login'
        }
        users[username] = this;
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
