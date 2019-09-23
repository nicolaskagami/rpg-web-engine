const uuidv4 = require('uuid/v4');
const fs = require('fs');
let _allEntities = {} ;
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
            this.uuid = "_".concat(uuidv4().replace(/-/g, ''));
        }
        if(_allEntities[this.uuid]!=null)
            throw new Error('Preexistent UUID')

        _allEntities[this.uuid]= this;
    }

    toJson()
    {
        return JSON.stringify(this);
    }

    static getEntity ({uuid})
    {
       return _allEntities[uuid]; 
    }

    static removeEntity ({uuid})
    {
       delete _allEntities[uuid]; 
    }

    static getEntities ()
    {
       return _allEntities; 
    }

    static storeEntities({entities, path})
    {
        fs.writeFileSync(path, JSON.stringify(entities))
    }
    static loadEntities({path})
    {
        var objects = [];
        var entities = [];
        objects = JSON.parse(fs.readFileSync(path, 'utf8'));
        for (var i = 0; i < objects.length; i++) {
            var dynamicConstructor = Object.prototype.constructor(this);
            try {
                entities.push(new dynamicConstructor({object: objects[i]}))
            } catch (error) { console.log(error); }
        }
        return entities;
    }
}
module.exports = Entity;
