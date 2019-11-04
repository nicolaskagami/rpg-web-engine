const Entity = require('./entity');
function createNDimArray(dimensions) {
    if (dimensions.length > 0) {
        var dim = dimensions[0];
        var rest = dimensions.slice(1);
        var newArray = new Array();
        for (var i = 0; i < dim; i++) {
            newArray[i] = createNDimArray(rest);
        }
        return newArray;
    } else {
        return undefined;
    }
}
class Field extends Entity
{
    //step size
    //starting position (x,y,z...) (offset)
    //dimensions (length of each dimension)
    //offset: where the origin starts in relation to the position of the field
    constructor({ object, stepSize, type, dimensions, offset })
    {
        super({object: object});
        if(object == null)
        {
            if(dimensions)
                this.field = createNDimArray(dimensions);
            this.dimensions = dimensions
            this.stepSize = stepSize;
            this.type = type;
        }
    }
}
module.exports = Field;
