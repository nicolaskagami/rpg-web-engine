const uuidv4 = require('uuid/v4');
const fs = require('fs');
class Entity 
{
    constructor({object})
    {
        if (object != null)
        {
            //Loading from JSON. Every property is loaded.
            for (const key of Object.keys(object)) 
                this[key] = object[key];

        } else {
            this.uuid = uuidv4();
        }
    }

    toJson()
    {
        return JSON.stringify(this);
    }

    static storeEntities({entities, path})
    {
        console.log(entities)
        console.log(path)
        fs.writeFileSync(path, JSON.stringify(entities))
    }
    static loadEntities({path})
    {
        var objects = [];
        var entities = [];
        objects = JSON.parse(fs.readFileSync(path, 'utf8'));
        for (var i = 0; i < objects.length; i++) {
            var dynamicConstructor = Object.prototype.constructor(this);
            entities.push(new dynamicConstructor({object: objects[i]}))
        }
        return entities;
    }
}
module.exports = Entity;
