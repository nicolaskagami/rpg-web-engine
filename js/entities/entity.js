const uuidv4 = require('uuid/v4');
const fs = require('fs');
const EntityManager = require('./entityManager');
class Entity 
{
    constructor({object}) //Constructors should receive objects
    {
        if (object != null)
        {
            //Loading from JSON. Every property is loaded.
            for (const key of Object.keys(object)) 
            {
                this[key] = object[key];
            }
            if(!this._uuid)
                this.__uuid = "_".concat(uuidv4().replace(/-/g, ''));

        } else {
            this.__uuid = "_".concat(uuidv4().replace(/-/g, ''));
        }

        this.__type = this.constructor.name;
        this.__manager = null;
    }
    setManager(manager)
    {
        this.__manager = manager;
    }
    end()
    {
        this.__manager.removeEntity(this.__uuid);
    }

    toJson()
    {
        var cache = [];
        var ent = JSON.stringify(this, function(key, value) {
            if (typeof value === 'object' && value !== null) {
                if (cache.indexOf(value) !== -1) return;
                cache.push(value);
            }
            return value;
        });
        cache = null; 
        return ent
    }

}
module.exports = Entity;
