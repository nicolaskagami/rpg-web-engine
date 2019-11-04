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
    interact(x0,x1,y0,y1, intensity )
    {}
}
module.exports = FieldType;
