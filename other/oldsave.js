const Grid = require('./grid');
const Entity = require('./entity');
const fs = require('fs');
class GameEngine 
{
    static loadData(path)
    {
        return JSON.parse(fs.readFileSync(path, 'utf8'))
    }
    static storeData(data,path)
    {
        fs.writeFileSync(path, JSON.stringify(data))
    }
}


var a = new Grid({ height: 2, width: 3 });
a.insertEntity('123',0,2);
console.log(a.entities['123']);
console.log(a)
//GameEngine.storeData(a,'./a.json');
//
//

var toClass = function(obj, proto) {
obj.__proto__ = proto;
return obj;
}
var b = toClass(GameEngine.loadData('./a.json'),Grid.prototype); 
var c = new Entity('./a.json');
console.log(c);

b.insertEntity('1234',0,2);
console.log(b)
module.exports = GameEngine;
