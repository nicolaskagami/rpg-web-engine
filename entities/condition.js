const Entity = require('./entity');
class Condition extends Entity
{
    constructor({object, expression, effects})
    {
        super({object: object});
        if(object == null)
        {
            this.expression = expression;
            this.effects = effects;
        }
    }

    execute()
    {
        var expr = this.__manager.getEntity(this.expression)
        for(var effect in this.effects)
        {
            var eff = this.__manager.getEntity(this.effects[effect])
            if(eff && expr)
                eff.execute()
        }

    }
}



module.exports = Condition;
