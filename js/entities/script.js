const Entity = require('./entity');
class Script extends Entity
{
    constructor({object})
    {
        super({object: object});
        if(object == null)
        {
            this.commands = []
        }
    }
    insertCommand(entity, order, parameters='')
    {
        this.commands.push({ent:entity,order:order,parameters:parameters})
    }
    clean()
    {
        var newCmds = [];
        for(var i in this.commands)
            if(this.__manager.getEntity(this.commands[i].ent))
                newCmds.push(this.commands[i])
        this.commands = newCmds;
    }
    execute()
    {
        for(var i in this.commands)
        {
            var ent = this.__manager.getEntity(this.commands[i].ent)
            var order = this.commands[i].order
            var parameters= this.commands[i].parameters
            if(ent && ent[order])
                ent[order](parameters)
        }
    }
}
module.exports = Script;
