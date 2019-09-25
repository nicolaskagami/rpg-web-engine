const Entity = require('./entity');
const math = require('mathjs');
class Filter extends Entity
{
    constructor({object, input, filter})
    {
        //Filter: property expression
        super({object: object});
        if(object == null)
        {
            if(!filter)
                throw new Error("Filter needs a filter expression")
            this.__filterInput = false;
            this.output = [];
            this.filter = filter
            if(input)
            {
                if(input.__type && input.__type == 'Filter')
                    this.__filterInput = true;
                this.input = input 
            }
        }
    }

    execute()
    {
        var entities = JSON.parse(this.__manager.getJSONEntities());
        var output = [];
        var scope;
        var prefilter;
        if (this.__filterInput) {
            prefilter = this.input.execute();
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
