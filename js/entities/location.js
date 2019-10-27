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
        console.log(this.entities)
    }
    getDistance(A, B)
    {
        var distance = []
        if(this.entities[A] && this.entities[B])
            for(var i in this.entities[A])
                distance[i] = this.entities[B][i] - this.entities[A][i] 
        return distance;
    }

}
module.exports = Location; 
