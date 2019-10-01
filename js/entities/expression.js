const Entity = require('./entity');
const EntityManager = require('./entityManager');
const expr = require('expression-eval')
class Expression extends Entity
{
    constructor({object, expression, defaultValue})
    {
        super({object: object});
        if(object == null)
        {
            this.expression = expression;
            this.ast= expr.parse(expression);
            this.defaultValue = ((defaultValue != null && (typeof defaultValue === "boolean")) ? defaultValue : false)
            this.output = []
        }
    }
    evaluate()
    {
        var scope = JSON.parse(this.__manager.getJSONEntitiesMap());
        scope.join = function(a,b)
        {
            console.log("mofo")
            c = a.concat(b)
            console.log(c)
            for(var i=0; i<c.length; ++i) 
                for(var j=i+1; j<c.length; ++j)
                    if(c[i] === c[j])
                        c.splice(j--, 1);
            return c;
        }
            //console.log(this.ast)
        try {
            this.output = (expr.eval(this.ast, scope))
            return this.output;
        } catch (error) { return this.defaultValue; }
    }
}
module.exports = Expression;
