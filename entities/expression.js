const Entity = require('./entity');
const Grid = require('./grid');
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
        var scope = JSON.parse(JSON.stringify(Entity.getEntities()));
        try {
            return (math.evaluate(this.expression, scope))
        } catch (error) { return this.defaultValue; }
    }
}

var a = new Expression({expression:"_771919bef77243d1b3c3e4a6556ef46e.height > 0"})
console.log(a.evaluate())
//Entity.removeEntity({uuid: a.uuid});
console.log(Entity.getEntities())
module.exports = Expression;
