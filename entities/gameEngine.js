const Grid = require('./grid');
const Entity = require('./entity');
var entities = Grid.loadEntities({path: './a.json'});
const Expression = require('./expression');
const fs = require('fs');
class GameEngine 
{
}

//console.log(Entity.getEntity({uuid:'771919be-f772-43d1-b3c3-e4a6556ef46e'}))
//console.log(entities)
//Grid.storeEntities({path: './b.json', entities: entities});

module.exports = GameEngine;
