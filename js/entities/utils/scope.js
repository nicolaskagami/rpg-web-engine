const expr = require('expression-eval')
const Trigger = require('../trigger')
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
        } else {
            return null;    
        }
    }
    static trigger(...args)
    {
        Trigger.trigger(__entities,...args)
    }
    SUM_OVER(array,expression)
    {
        var result = 0;
        for(var i=0; i < array.length;i++) 
        {
            var obj= '';
            var ast2 = expr.parse(expression)
            var internalScope = Scope.newInternalScope(array[i]);
            if(internalScope != null)
                result += expr.eval(ast2, internalScope)
        }
        return result;
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
    TRIGGER(...args)
    {
        return Scope.trigger(...args);
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
module.exports = Scope;
