const Entity = require('./entity');
const EntityManager = require('./entityManager');
class Container extends Entity
{
    constructor({object, expression})
    {
        super({object: object});
        if(object == null)
        {
            this.expression = expression;
            this.content = [];
        }
    }
    insert(entUUID)
    {
        var expr = this.__manager.getEntity(this.expression)
        var ent = this.__manager.getEntity(entUUID)
        var tentativeContent = JSON.parse(JSON.stringify(this.content))
        tentativeContent.push(entUUID)
        if(expr && expr.evaluate(ent, tentativeContent)) {
            this.content.push(entUUID);
            return true;
        } else {
            return false;
        }
    }
}
module.exports = Container;
