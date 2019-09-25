function isArray(what) {
    return Object.prototype.toString.call(what) === '[object Array]';
}

class EntityManager {
    constructor()
    {
        this.entities = {};
    }
    addEntity(entity)
    {
       if(this.entities[entity.__uuid]) 
            throw new Error('Preexistent UUID')
        else
            this.entities[entity.__uuid] = entity;
        entity.setManager(this);
    }
    getEntity (uuid)
    {
       return this.entities[uuid]; 
    }

    removeEntity (uuid)
    {
       delete this.entities[uuid]; 
    }

    getEntities()
    {
        return this.entities;
    }
    getJSONEntitiesMap()
    {
        //Stringify ignoring circular references
        var cache = [];
        var ents = JSON.stringify(this.entities, function(key, value) {
            if (typeof value === 'object' && value !== null) {
                if (Object.getPrototypeOf(value).constructor.name == "EntityManager") return;
                if (cache.indexOf(value) !== -1) return;
                cache.push(value);
            }
            return value;
        });
        cache = null; 
        return ents
    }
    
    getJSONEntitiesArray(uuidList)
    {
        var entityArray = []
        for(var i in this.entities)
        {
            if(!uuidList || uuidList.includes(i))
                entityArray.push(this.entities[i])
        }

        var cache = [];
        var ents = JSON.stringify(entityArray, function(key, value) {
            if (typeof value === 'object' && value !== null) {
                if (Object.getPrototypeOf(value).constructor.name == "EntityManager") return;
                if (cache.indexOf(value) !== -1) return;
                cache.push(value);
            }
            return value;
        },2);
        cache = null; 
        return ents
    }
    loadEntities(objects)
    {
        if(isArray(objects))
            for (var i = 0; i < objects.length; i++) 
                this.addEntity(this.revive(objects[i]));
        else
            this.addEntity(this.revive(objects));
    }

    revive(object)
    {
        var entities = [];
        if(object.hasOwnProperty('__type'))
        {
            var dynamicConstructor = entityTypes[object.__type] 
            try {
                return new dynamicConstructor({object: object})
            } catch (error) { console.log(error); }
        }
    }

}
module.exports = EntityManager;
//Must be kept after exporting EntityManager (to avoid circular dependencies)
const entities = require('require-all')({
    dirname     :  __dirname, 
    filter      :  /(.)\.js$/,
    map     : function (name, path) {
        return path.split('\\').pop().split('/').pop();
    }
});

var entityTypes = []
for (const key of Object.keys(entities)) 
    entityTypes[(entities[key].name)] = entities[key]

