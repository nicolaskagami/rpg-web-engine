const Entity = require('./entity');
//Grid should model:
// Entity Position
// Visibility?
// Reachability?
// Tile properties?
class Grid extends Entity
{
    constructor({object, height, width})
    {
        super({object: object});
        if(object == null)
        {
            this.height = height;
            this.width = width;
            this.turn = 0;
            this.entities = {};//Objects: physical entities?
        }
    }
    insertEntity(entityUUID, x, y)
    {
        this.entities[entityUUID] = { 'x': x, 'y': y};
    }
    getVisibility(entityUUID, range)
    {
        
    }
}


module.exports = Grid;