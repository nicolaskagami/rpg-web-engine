const Entity = require('./entity');
const EntityManager = require('./entityManager');
const math = require('mathjs');
class Expression extends Entity
{
    constructor({object, expression, defaultValue})
    {
        super({object: object});
        if(object == null)
        {
            this.expression = expression;
            this.defaultValue = ((defaultValue != null && (typeof defaultValue === "boolean")) ? defaultValue : false)
        }
    }
    evaluate()
    {
        var scope = JSON.parse(this.__manager.getEntities());
        console.log(scope)
        try {
            return (math.evaluate(this.expression, scope))
        } catch (error) { return this.defaultValue; }
    }
}

//Entity.removeEntity({uuid: a.uuid});
module.exports = Expression;
