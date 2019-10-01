const Entity = require('./entity');
class Grid extends Entity
{
    constructor({path, height, width})
    {
        super(path);
        if(path == null)
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
var a = new Grid({ height: 2, width: 3 });
a.insertEntity('123',0,2);
console.log(a)

//Example of loading Grid Entity from json
var b = new Grid({ path: './a.json' });
b.insertEntity('1234',0,3);
console.log(b)

module.exports = Grid;
