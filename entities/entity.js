const uuidv4 = require('uuid/v4');
const fs = require('fs');
const EntityManager = require('./entityManager');
let _allEntities = {} ;
class Entity 
{
    constructor({object})
    {
        if (object != null)
        {
            //Loading from JSON. Every property is loaded.
            for (const key of Object.keys(object)) 
            {
                this[key] = object[key];
            }

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

    toJson()
    {
        this.__manager = null;
        return JSON.stringify(this);
    }

}
module.exports = Entity;
