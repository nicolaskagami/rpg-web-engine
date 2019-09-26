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
        }
    }
    //Files owned?
    //Dynamic available Commands?

}
module.exports = User;
