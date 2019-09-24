const Entity = require('./entity');
class Condition extends Entity
{
    constructor({object, expression, effect})
    {
        super({object: object});
        if(object == null)
        {
            this.expression = expression;
            this.effect = effect;
        }
    }

    execute()
    {
        console.log("Condition.execute")
        var expr = this.__manager.getEntity(this.expression)
        var eff = this.__manager.getEntity(this.effect)
        if(eff && expr)
            eff.execute()

    }
}



module.exports = Condition;
