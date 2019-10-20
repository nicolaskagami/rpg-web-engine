const Entity = require('./entity');
class Effect extends Entity
{
    constructor({object, target, method, parameters})
    {
        super({object: object});
        if(object == null)
        {
            if(!(target && method && parameters))
                throw new Error("new Effect Entity needs target, method, parameters")
            this.target = target;
            this.method = method;
            this.parameters = parameters;
        }
    }
    setParameters(param)
    {
        this.parameters = param
        return true;
    }
    execute()
    {
        var target = this.__manager.getEntity(this.target)
        console.log("effect exec target:", target)
        if(target)
            target[this.method](this.parameters)
    }
}
module.exports = Effect;
