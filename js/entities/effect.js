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
        var expr = this.__manager.getEntity(this.result)
        var target = this.__manager.getEntity(this.target)
        if(target && expr)
            target[this.property] = expr.evaluate();
    }
    end()
    {
        var expr = this.__manager.getEntity(this.result)
        if(expr)
            expr.end()
        super.end()
    }
}
module.exports = Effect;
