const Grid = require('./grid');
const Entity = require('./entity');
const fs = require('fs');
class GameEngine 
{
}

var entities = Grid.loadEntities({path: './a.json'});
console.log(entities)
Grid.storeEntities({path: './b.json', entities: entities});

module.exports = GameEngine;
