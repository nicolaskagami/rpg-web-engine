const Entity = require('./entity');
const expr = require('expression-eval')
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
            this.ast= expr.parse(filter)
                console.log(this.ast)
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
                var filter = this.ast; 
                try {
                    if(expr.eval(filter, scope))
                        output.push(scope.__uuid);
                }catch(e){ }
            }
        }
        this.output = output;
        return output;
    }
}
module.exports = Filter;
