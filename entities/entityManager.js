var fs = require('fs')
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
    getJSONEntities()
    {
        //Stringify ignoring circular references
        var cache = [];
        var ents = JSON.stringify(this.entities, function(key, value) {
            if (typeof value === 'object' && value !== null) {
                if (cache.indexOf(value) !== -1) return;
                cache.push(value);
            }
            return value;
        });
        cache = null; 
        return ents
    }
    storeEntities({entities, path})
    {
        var entityArray = []
        for(var i in this.entities)
            entityArray.push(this.entities[i])

        var cache = [];
        var ents = JSON.stringify(entityArray, function(key, value) {
            if (typeof value === 'object' && value !== null) {
                if (cache.indexOf(value) !== -1) return;
                cache.push(value);
            }
            return value;
        });
        cache = null; 

        fs.writeFileSync(path, ents)
    }
    loadEntities({path})
    {
        var objects = [];
        objects = JSON.parse(fs.readFileSync(path, 'utf8'));

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

const Entity = require('./entity');
const Expression = require('./expression');
const Condition = require('./condition');
const Effect = require('./effect');
const Filter= require('./filter');
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

var a = new EntityManager();
a.loadEntities({path: './b.json'})
console.log(a.getEntities());
