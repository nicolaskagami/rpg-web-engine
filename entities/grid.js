const Entity = require('./entity');
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

//Example of new Grid Entity
//var a = new Grid({ height: 2, width: 3 });
//a.insertEntity('123',0,2);
//console.log(a)


module.exports = Grid;
