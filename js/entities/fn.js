const Entity = require('./entity');
const EntityManager = require('./entityManager');
const expr = require('expression-eval')
const Trigger = require('./trigger')
const Scope = require('./utils/scope')
class Fn extends Entity
{
    //Function is an expression that can be evaluated multiple times a round, receiving different parameters at a time
    constructor({object, expression, defaultValue})
    {
        super({object: object});
        if(object == null)
        {
            this.expression = expression;
            this.ast= expr.parse(expression);
            this.defaultValue = ((defaultValue != null && (typeof defaultValue === "boolean")) ? defaultValue : false)
        }
    }
    evaluate(...args)
    {
        return this.execute(...args)
    }
    execute(...args)
    {
        var scope = new Scope(this.__manager.getEntities());
        for(var i in args)
            scope['args'+i] = args[i]
        try {
            return (expr.eval(this.ast, scope))
        } catch (error) { return this.defaultValue; }
    }
}
module.exports = Fn;
