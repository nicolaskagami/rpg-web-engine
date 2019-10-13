const Entity = require('./entity');
class Effect extends Entity
{
    constructor({object, target, method, parameters})
    {
        super({object: object});
        if(object == null)
        {
            console.log(target, method, parameters)
            if(!(target && method && parameters))
                throw new Error("new Effect Entity needs target, method, parameters")
            this.target = target;
            this.method = method;
            this.parameters = parameters;
        }
    }
    execute()
    {
        var target = this.__manager.getEntity(this.target)
        if(target)
            target[this.method](this.parameters)
        console.log(target)
    }
}
module.exports = Effect;
