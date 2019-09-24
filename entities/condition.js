const Entity = require('./entity');
class Condition extends Entity
{
    constructor({object, expression, exitCondition, effects})
    {
        super({object: object});
        if(object == null)
        {
            this.expression = expression;
            this.effects = effects;
            if(exitCondition)
                this.exitCondition = exitCondition
        }
    }

    execute()
    {
        var expr = this.__manager.getEntity(this.expression)
        if(expr && expr.evaluate())
            for(var effect in this.effects)
            {
                var eff = this.__manager.getEntity(this.effects[effect])
                if(eff)
                    eff.execute()
            }

        var exitExpr = this.__manager.getEntity(this.exitCondition)
        if(!(exitExpr && !expr.evaluate()))
            this.end();
    }
    end()
    {
        var expr = this.__manager.getEntity(this.expression)
        for(var effect in this.effects)
        {
            var eff = this.__manager.getEntity(this.effects[effect])
            if(eff && expr)
                eff.end()
        }
        if(expr) 
            expr.end();
        super.end();
    
    }
}



module.exports = Condition;
