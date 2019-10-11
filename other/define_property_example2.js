//Recursion problem: Either have a true attribute or a getter
class A 
{
    constructor()
    {
        this.b = 2
    }
}
var a = new A
function defGetSet (object,field_name) {
    Object.defineProperty (object, field_name, {
        get: function () { 
            console.log('GET', field_name);
            return this[field_name];
        },
        set: function (new_value) {
            console.log('SET', field_name, new_value);
            object[field_name] = new_value;
        }
    });
}
defGetSet(a,'b');
console.log(a.b)
a.b = 3
console.log(a.b)
