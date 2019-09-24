const Entity = require('./entity');
class Effect extends Entity
{
    constructor({object, target, property, result})
    {
        super({object: object});
        if(object == null)
        {
            this.target = target;
            this.property = property;
            this.result = result;
        }
    }
    execute()
    {
        console.log("Effect.execute")
        var expr = this.__manager.getEntity(this.result)
        var target = this.__manager.getEntity(this.target)
        console.log(target, this.result,expr)
        if(target && expr)
        target[this.property] = expr.evaluate();
        
    }
}



module.exports = Effect;
