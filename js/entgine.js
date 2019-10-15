const uuidv4 = require('uuid/v4');
const EntityManager = require('./entities/entityManager')
const Expression = require('./entities/expression')
class Entgine
{
    constructor(entManager)
    {
        this.orders = {}
        this.agentLoop = [];//Iniciative
        this.currentAgentIndex = 0;
        this.history = []
        this.waitForOrder = true;
        this.entityManager = entManager;
    }
    nextOrder()
    {
        //Mutexes?
        var currentEnt = this.agentLoop[this.currentAgentIndex];
        if(this.orders[currentEnt] && this.orders[currentEnt].length)
        {
            this.executeOrder(currentEnt, this.orders[currentEnt].shift())
        } else if(this.waitForOrder)
            console.log("Waiting for Order of Ent: "+currentEnt)  
        else
            this.incrementAgentIndex();
    }
    incrementAgentIndex()
    {
        this.currentAgentIndex = (this.currentAgentIndex + 1 )% this.agentLoop.length;
    }
    getAgentLoop()
    {
        return this.agentLoop;
    }
    edit({entity,attribute,result})
    {
        var ent = this.entityManager.getEntity(entity) 
        if(ent)
        {
            var expr = new Expression({expression:result}) 
            this.entityManager.addEntity(expr)
            ent[attribute] = (expr.execute())
            this.entityManager.removeEntity(expr.__uuid)
        }
    }
    execute(expression)
    {
        var expr = new Expression({expression:expression}) 
        this.entityManager.addEntity(expr)
        expr.execute()
        this.entityManager.removeEntity(expr.__uuid)
    }
    setAgentLoop(newLoop)
    {
        this.agentLoop = newLoop;
    }
    insertOrder(ent, order)
    {
        if(!this.orders[ent])
            this.orders[ent] = []
        this.orders[ent].push(order);
    }
    executeOrder(ent, order)
    {
        var entPointer = this.entityManager.getEntity(ent)
            console.log("Order <"+ent+"> "+order)
        if(entPointer && entPointer[order])
        {
            entPointer[order]()
        }
        this.incrementAgentIndex();
        this.saveSnapshot(ent);
    }
    saveSnapshot(ent)
    {
        console.log("Saving Snapshot")
        this.history.push({
            uuid: uuidv4(),
            entity:ent,
            entities:this.entityManager.getJSONEntitiesArray(),
            orders: JSON.stringify(this.orders),
            agentLoop: JSON.stringify(this.agentLoop),
            currentAgentIndex: this.currentAgentIndex
        })//add Json of world + entgine (w/o history)? 
    }
    recoverSnapshot(uuid)
    {
        for(var i in this.history)
        {
            if(this.history[i].uuid == uuid)
            {
                var snapshot = this.history[i]
                this.orders = JSON.parse(snapshot.orders); 
                this.agentLoop = JSON.parse(snapshot.agentLoop); 
                this.currentAgentIndex = snapshot.currentAgentIndex; 
                this.entityManager.entities = {};
                this.entityManager.loadEntities(JSON.parse(snapshot.entities));
            }
        }
    }
    undo()
    {
        if(this.history && this.history.length)
        {
            this.recoverSnapshot(this.history[this.history.length-1].uuid);
            this.history.pop();
        }
        if(this.history && this.history.length)
        {
            this.recoverSnapshot(this.history[this.history.length-1].uuid);
            this.history.pop();
        }
    }
}
module.exports = Entgine;
