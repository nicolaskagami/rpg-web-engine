const Entity = require('./entity');
class FieldType extends Entity
{
    constructor( { object, name })
    {
        super({object: object});
        if(object == null)
        {
            this.name = name;
        }
    }
    interact(entity, startPosition, endPosition, intensity, fields)
    {}
}
module.exports = FieldType;
