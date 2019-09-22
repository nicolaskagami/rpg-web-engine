const uuidv4 = require('uuid/v4');
const fs = require('fs');
class Entity 
{
    constructor(path)
    {
        if ((path != null) && (typeof(path)==='string'))
        {
            //Loading from JSON. Every property is loaded.
            var obj = JSON.parse(fs.readFileSync(path, 'utf8'))
            for (const key of Object.keys(obj)) {
                this[key] = obj[key];
            }
        } else {
            this.uuid = uuidv4();
        }
    }
    toJson()
    {
        return JSON.stringify(this);
    }
    static loadEntities(path)
    {
        var entities = [];
        entities = JSON.parse(fs.readFileSync(path, 'utf8'));
        for (var i = 0; i < entities.length; i++) {

    }
}
module.exports = Entity;
