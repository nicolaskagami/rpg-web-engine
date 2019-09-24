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
    getEntity ({uuid})
    {
       return this.entities[uuid]; 
    }

    removeEntity ({uuid})
    {
       delete this.entities[uuid]; 
    }

    getEntities()
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
        console.log(ents)
        return ents
    }
    storeEntities({entities, path})
    {
        fs.writeFileSync(path, JSON.stringify(entities))
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
//console.log(loadEntities({path: 'a.json'}))
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
a.loadEntities({path: './a.json'})
var b = new Entity({});
a.addEntity(b);
console.log(b.toJson());
console.log(a.getEntities());
var c = new Expression({expression:"_771919bef77243d1b3c3e4a6556ef46e.height > 1"})
a.addEntity(c);
console.log(c.evaluate())
