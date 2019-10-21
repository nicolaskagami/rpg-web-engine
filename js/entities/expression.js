const Entity = require('./entity');
const EntityManager = require('./entityManager');
const expr = require('expression-eval')
const Trigger = require('./trigger');
const Scope = require('./utils/scope')
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
            this._output = null 
        }
    }
    get output()
    {
        try {
            if(this._output === null)
                this.execute();
            return this._output;
        } catch (error) { return this.defaultValue; }
    }
    reset()
    {
        this._output = null;
    }
    evaluate()
    {
        return this.output;
    }
    execute()
    {
        var scope = new Scope(this.__manager.getEntities());
        try {
            this._output = (expr.eval(this.ast, scope))
            return this._output;
        } catch (error) { return this.defaultValue; }
    }
}
module.exports = Expression;
