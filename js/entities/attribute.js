const Entity = require('./entity');
class Attribute extends Entity
{
    constructor({object, target, property, result})
    {
        super({object: object});
        if(object == null)
        {
            if(!(target && property && result))
                throw new Error("new Attribute Entity needs target, property, result")
            this.target = target;
            this.property = property;
            this.result = result;
            this._output =null;
            this.mods = []
        }
    }
    get output()
    {
        if(this._output === null)
            this.execute();
        return this._output;
    }
    execute()
    {
        var expr = this.__manager.getEntity(this.result)
        this._output = expr.execute()
        for(var i in this.mods)
        {
            expr = this.__manager.getEntity(this.mods[i]) 
            if(expr)
                this._output = expr.execute()
        }
    }
    newMod(modUUID)
    {
       this.mods.push(modUUID) 
    }
    apply()
    {
        var expr = this.__manager.getEntity(this.result)
        var target = this.__manager.getEntity(this.target)
        if(target && expr)
        {
            var obj = this;
            Object.defineProperty(target,this.property, {
                get: function(){
                    return obj.output; 
                },
                set: function(modUUID){
                    obj.newMod(modUUID)
                },
                enumerable: true
            })
        }
    }
    end()
    {
        var expr = this.__manager.getEntity(this.result)
        if(expr)
            expr.end()
        super.end()
    }
}
module.exports = Attribute;
