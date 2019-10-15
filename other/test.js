class A 
{
    constructor()
    {
        this.baseSTR = 2
    }
}
var a = new A
function defGetSet (object,field_name) {
    Object.defineProperty (object, field_name, {
        get: function () { 
            console.log('GET', field_name);
            return this.baseSTR + 1;
        },
        set: function (new_value) {
            console.log('NO SET FOR YOU', field_name, new_value);
        }
    });
}
defGetSet(a,'str');
a.str=2
console.log(a.str)
console.log("Stringified")
console.log(Object.assign({}, a))
a2 = JSON.parse(JSON.stringify(a))
console.log(a2.str)
a2.str=2
console.log(a2.str)
