const Entity = require('./entity');
const EntityManager = require('./entityManager');
const expr = require('expression-eval')
class Expression extends Entity
{
    constructor({object, expression, defaultValue})
    {
        super({object: object});
        if(object == null)
        {
            this.expression = expression;
            this.ast= expr.parse(expression);
            this.defaultValue = ((defaultValue != null && (typeof defaultValue === "boolean")) ? defaultValue : false)
            this.output = null 
        }
    }
    evaluate()
    {
        try {
            if(this.output === null)
                this.execute();
            return this.output;
        } catch (error) { 
            return this.defaultValue; 
        }
    }
    execute()
    {
        console.log("Exec: "+this.__uuid)
        var ast = this.ast;
        if(ast.arguments)// evaluate subexpressions
            for(var arg in this.ast.arguments)
                if(ast.arguments[arg].property.name === 'output')
                    if(this.__manager.entities[ast.arguments[arg].object.name])
                        this.__manager.entities[ast.arguments[arg].object.name].evaluate()
        var scope = JSON.parse(this.__manager.getJSONEntitiesMap());
        scope.FILTER= function(array,expr)
        {
            var result = []
            for(var i=0; i < array.length;i++) 
            {
                var ent = array[i]
                if(expr)
                    result.push(array[i])
            }
            return result;
        }
                    
        scope.OR = function(a,b)
        {
            var c = a.concat(b)
            for(var i=0; i<c.length; i++) 
                for(var j=i+1; j<c.length; j++)
                    if(c[i] === c[j])
                        c.splice(j--, 1);
            return c;
        }
        scope.AND = function(a,b)
        {
            var c = [] 
            for(var i=0; i<a.length; i++) 
                for(var j=0; j<b.length; j++)
                    if(a[i] === b[j])
                        c.push(a[i])
            return c;
        }
        try {
            this.output = (expr.eval(this.ast, scope))
            return this.output;
        } catch (error) { return this.defaultValue; }
    }
}
module.exports = Expression;
