const Entity = require('./entity');
class Property extends Entity
{
    constructor({object, target, property, setter, defaultValue=0})
    {
        super({object: object});
        if(object == null)
        {
            if(!(target && property))
                throw new Error("new Property Entity needs target, property")
            this.target = target;
            this.property = property;
            this.setter = setter;
            this._output = defaultValue;
        }
    }
    get output()
    {
        if(this._output === null)
            this.execute();
        return this._output;
    }
    set output(newValue)
    {
        var fn = this.__manager.getEntity(this.setter)
        if(fn)
            this._output = fn.execute(newValue)
        else
            this._output(newValue) 
    }
    apply()
    {
        var target = this.__manager.getEntity(this.target)
        if(target)
        {
            var obj = this;
            Object.defineProperty(target,this.property, {
                get: function(){
                    return obj.output; 
                },
                set: function(newValue){
                    obj.output = newValue;
                },
                enumerable: true
            })
        }
    }
}
module.exports = Property; 
