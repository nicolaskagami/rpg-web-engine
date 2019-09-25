const fs = require('fs')
const EntityManager = require('./entities/entityManager')
const User = require('./user')
class Session
{
    //Models a game session
    //  Multiple Users
    //  1 Entity Manager
    constructor()
    {
        this.users = {}
        this.entityManager = new EntityManager()
    }
    insertUser(username)
    {
        if(!this.users[username])
        {
            this.users[username] = {visibleEntities: [], commandedEntities: []}
        }
    }
    insertVisibleEntities({username, entities})
    {
        if(this.users[username])
            for (var i = 0; i < entities.length; i++) 
                this.users[username].visibleEntities.push(entities[i]);
    }
    getVisibleEntities(username)
    {
        if(this.users[username])
            return this.entityManager.getJSONEntitiesArray(this.users[username].visibleEntities);
    }
    storeEntities(path)
    {
        var jsonObjects = this.entityManager.getJSONEntitiesArray();
        fs.writeFileSync(path, jsonObjects)
    }
    loadEntities(path)
    {
        var objects = [];
        objects = JSON.parse(fs.readFileSync(path, 'utf8'));
        this.entityManager.loadEntities(objects);
    }
    //Insert
    //Remove
    //Order entity
//  Session.getCommandedEntities
//  Session.loadSave (admin only?)
//  Session.broadcast
//  Session.entity.order


}
module.exports = Session;

var session = new Session();
session.insertUser('Bob');
session.insertVisibleEntities({username: 'Bob',entities:['_771919bef77243d1b3c3e4a6556ef46e','_e71919bef77243d1b3c3e4a6556ef46e']})
session.loadEntities('./assets/b.json')
console.log(session.getVisibleEntities('Bob'))
//session.entityManager.entities['_5a48a4a64fd24072b154b2246c91a341'].execute();
//console.log(session.entityManager.entities['_175fb71dd3064e6dabc2822e355f8fc7'].execute());
session.storeEntities('./assets/c.json')
//console.log(session.getVisibleEntities('Bob'))
//console.log(a.getEntities());
