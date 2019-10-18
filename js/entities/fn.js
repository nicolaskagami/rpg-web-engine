const Entity = require('./entity');
const EntityManager = require('./entityManager');
const expr = require('expression-eval')
class Fn extends Entity
{
    //Function is an expression that can be evaluated multiple times a round, receiving different parameters at a time
    constructor({object, expression, defaultValue})
    {
        super({object: object});
        if(object == null)
        {
            this.expression = expression;
            this.ast= expr.parse(expression);
            this.defaultValue = ((defaultValue != null && (typeof defaultValue === "boolean")) ? defaultValue : false)
        }
    }
    execute(...args)
    {
        var scope = new Scope(this.__manager.getEntities());
        for(var i in args)
            scope['args'+i] = args[i]
        try {
            return (expr.eval(this.ast, scope))
        } catch (error) { return this.defaultValue; }
    }
}
var __entities ={};
class Scope
{
    constructor(entities)
    {
        __entities = entities;
        for(const key of Object.keys(entities))
        {
            this[key] = entities[key]
        }
        
    }
    static newInternalScope(ent)
    {
        if(__entities[ent]) {
            var internalScope = new Scope(__entities) 
            for (const key of Object.keys(__entities[ent])) 
                internalScope[key] = __entities[ent][key];
            return internalScope;
            console.log(internalScope)
        } else {
            return null;    
        }
    }
    FILTER(array,expression)
    {
        var result = []
        for(var i=0; i < array.length;i++) 
        {
            var obj= '';
            var ast2 = expr.parse(expression)
            var internalScope = Scope.newInternalScope(array[i]);
            if((internalScope != null) && (expr.eval(ast2, internalScope)))
                    result.push(array[i])
        }
        return result;
    }
    OR(a,b)
    {
        var c = a.concat(b)
        for(var i=0; i<c.length; i++) 
            for(var j=i+1; j<c.length; j++)
                if(c[i] === c[j])
                    c.splice(j--, 1);
        return c;
    }
    AND(a,b)
    {
        var c = [] 
        for(var i=0; i<a.length; i++) 
            for(var j=0; j<b.length; j++)
                if(a[i] === b[j])
                    c.push(a[i])
        return c;
    }
}
module.exports = Fn;
