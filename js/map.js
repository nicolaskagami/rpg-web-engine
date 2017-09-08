var Tile = function()
{
    //this.texture
    this.light_level = 0;
    this.terrain_difficulty = 0;
    this.forbidden = false;
    this.tokens = [];
}; 

Tile.prototype =
{
    print: function()
    {
        console.log(this);
    }
};

var Map = function (Width,Height)
{
    this.tiles = [];
    this.height = Height;
    this.width = Width;
    for(i=0;i<this.width*this.height;i++)
    {
        this.tiles[i] = new Tile()
    }
};

Map.prototype = 
{
    forbidTile: function(x,y)
    {
        this.tiles[y*this.width+x].forbidden = true;
    }
    ,
    testTile: function(x,y)
    {
        if(this.tiles[y*this.width+x].forbidden)
            return true;
        else
            return false;
    },
    cleanMap: function()
    {
        for(i=0;i<this.width*this.height;i++)
        {
                this.tiles[i].forbidden = false;
        }
    },
    printMap: function()
    {
        for(i=0;i<this.width*this.height;i++)
        {
            if(this.tiles[i].occupied == true)
                this.tiles[i].print();
        }
    }


};
