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
}



module.exports = Condition;
