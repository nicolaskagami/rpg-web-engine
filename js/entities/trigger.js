const Entity = require('./entity');
const EntityManager = require('./entityManager');
class Trigger extends Entity
{
    constructor({object, fn, effect})
    {
        super({object: object});
        if(object == null)
        {
            this.fn = fn;
            this.effect = effect;
        }
    }
    evaluate(triggerType,entity,...args)
    {
        console.log("Trigger:"+triggerType, entity,args)
        var fn = this.__manager.getEntity(this.fn)
        var eff = this.__manager.getEntity(this.effect)
        if(fn && fn.execute(triggerType,entity,...args) && eff)
        {
            eff.execute()
        }
    }
    static trigger(ents,triggerType,entity,...args)
    {
        for(var i in ents)
        {
            if(ents[i].__type == 'Trigger')
                ents[i].evaluate(triggerType,entity,...args)
        }
    }
}
module.exports = Trigger;
