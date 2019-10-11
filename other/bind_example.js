var obj = { x: 1}
function getX(){ return this.x+1 }
obj.getX = getX.bind(obj)
console.log(obj.getX())
