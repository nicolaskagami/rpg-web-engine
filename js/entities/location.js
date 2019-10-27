const Entity = require('./entity');
class Location extends Entity
{
    constructor({object})
    {
        super({object: object});
        if(object == null)
        {
            this.entities = {};
             
        }
    }
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

}
module.exports = Location; 
