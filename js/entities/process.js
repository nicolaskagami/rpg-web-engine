const Entity = require('./entity');
class Process extends Entity
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
        if(expr && expr.evaluate() === true)
            for(var effect in this.effects)
            {
                console.log("Effect", effect)
                var eff = this.__manager.getEntity(this.effects[effect])
                if(eff)
                    eff.execute()
            }

        var exitExpr = this.__manager.getEntity(this.exitCondition)
        if(!(exitExpr && expr.evaluate() === false))
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
        var exitExpr = this.__manager.getEntity(this.exitCondition)
        if(exitExpr)
            exitExpr.end();
        super.end();
    
    }
}



module.exports = Process; 
