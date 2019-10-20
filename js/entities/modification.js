const Entity = require('./entity');
class Modification extends Entity
{
    constructor({object, target, property, result})
    {
        super({object: object});
        if(object == null)
        {
            if(!(target && property && result))
                throw new Error("new Modification Entity needs target, property, result")
            this.target = target;
            this.property = property;
            this.result = result;
        }
    }
    setTarget(target)
    {
        this.target = target;
        return true;
    }
    execute(...args)
    {
        var expr = this.__manager.getEntity(this.result)
        var target = this.__manager.getEntity(this.target)
        if(target && expr)
        {
            console.log(target)
            target[this.property] = expr.evaluate(...args);
            console.log(target)
        }
    }
    end()
    {
        var expr = this.__manager.getEntity(this.result)
        if(expr)
            expr.end()
        super.end()
    }
}
module.exports = Modification;
