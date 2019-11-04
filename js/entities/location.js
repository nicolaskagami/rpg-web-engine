const Entity = require('./entity');
class Location extends Entity
{
    constructor({object})
    {
        super({object: object});
        if(object == null)
        {
            this.entities = {}; //[ent_uuid]: position
            this.fieldTypes = {}; //[name]: uuid
            this.fields = {}; //[ent_uuid]: fieldType name
        }
    }
    //An associated field can be set with the position of its bearer
    setPosition(entity, position)
    {
        this.entities[entity] = position;
    }
    getDistance(A, B)
    {
        var distance = []
        if(this.entities[A] && this.entities[B])
        {
            var length = (this.entities[A].length > this.entities[B].length)? 
                this.entities[A].length : this.entities[B].length
            for(var i = 0; i < length; i++)
            {
                var a = (this.entities[A][i]) ? this.entities[A][i] : 0
                var b = (this.entities[B][i]) ? this.entities[B][i] : 0
                distance[i] = b - a
            }
        }
        return distance;
    }

    setFieldType(fieldTypeUUID)
    {
        var fieldTypeEnt = this.__manager.getEntity(fieldTypeUUID)
        if(fieldTypeEnt && !this.fieldTypes[fieldTypeEnt.name])
        {
            this.fieldTypes[fieldTypeEnt.name] = fieldTypeUUID;
        }
    }
    setField(fieldUUID)
    {
        var fieldEnt = this.__manager.getEntity(fieldUUID)
        if(fieldEnt && !this.fields[fieldUUID])
        {
            this.fields[fieldUUID] = fieldEnt.type;
        }
    }
    traverse(entity, fieldType, endPosition,intensity)
    {
        if(this.fieldTypes[fieldType] && this.entities[entity])
        {
            var fieldTypeEnt = this.__manager.getEntity(this.fieldTypes[fieldType])
            var fields = {}
            for(var i in this.fields)
            {
                if(this.fields[i] == fieldType)
                {
                }
            }
            fieldTypeEnt.interact(entity, this.entities[entity], endPosition, intensity, fields) 
        }
         
    }

}
module.exports = Location; 
