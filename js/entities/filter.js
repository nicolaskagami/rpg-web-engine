const Entity = require('./entity');
const math = require('mathjs');
class Filter extends Entity
{
    constructor({object, input, filter, filterInput})
    {
        //Filter: property expression
        super({object: object});
        if(object == null)
        {
            if(!filter)
                throw new Error("Filter needs a filter expression")
            this.output = [];
            this.filter = filter
            if(input)
                this.input = input 
            if(filterInput)
                this.filterInput = filterInput
            else
                this.filterInput = false;
        }
    }

    execute()
    {
        var entities = JSON.parse(this.__manager.getJSONEntitiesMap());
        var output = [];
        var scope;
        var prefilter;
        if (this.filterInput && entities[this.input]) {
            prefilter = this.__manager.entities[this.input].execute();
        } else {
            prefilter = this.input;
        }
        for(var i in entities)
        {
            var scope = entities[i]
            if(!prefilter || prefilter.includes(scope.__uuid))
            {
                var filter = this.filter; 
                try {
                    if(math.evaluate(filter, scope))
                        output.push(scope.__uuid);
                }catch(e){ }
            }
        }
        this.output = output;
        return output;
    }
}
module.exports = Filter;