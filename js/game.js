var marker;
var currentLayer;
var currentTile;
var GameFunction = function()
{
    this.user_map={};
};

GameFunction.prototype = 
{
    init: function()
    {
        game.stage.disableVisibilityChange = true;
    },
    preload: function() 
    {
        game.load.tilemap('map', 'assets/map/example_map.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('ground_1x1', 'assets/tilesets/ground_1x1.png');
        game.load.spritesheet('tileset', 'assets/map/tilesheet.png',32,32);
        game.load.image('sprite','assets/sprites/sprite.png');
    },

    create: function()
    {
        game.stage.backgroundColor = '#2d2d2d';

        //  Creates a blank tilemap
        this.map = game.add.tilemap();

        //  Add a Tileset image to the map
        this.map.addTilesetImage('ground_1x1');


        //  Creates a new blank layer and sets the map dimensions.
        //  In this case the map is 40x30 tiles in size and the tiles are 32x32 pixels in size.
        this.layer1 = this.map.create('level1', 100, 100, 32, 32);
        this.layer1.scrollFactorX = 1;
        this.layer1.scrollFactorY = 1;
        this.layer1.resizeWorld();
        this.cursors = game.input.keyboard.createCursorKeys();
        currentLayer=this.layer1;
        this.createTileSelector();
       
        /* 
        var testKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        testKey.onDown.add(Client.sendTest, this);
        var map = game.add.tilemap('map');
        map.addTilesetImage('tilesheet', 'tileset'); // tilesheet is the key of the tileset in map's JSON file
        var layer;
        for(var i = 0; i < map.layers.length; i++) 
        {
            layer = map.createLayer(i);
        }
        layer.inputEnabled = true; // Allows clicking on the map ; it's enough to do it on the last layer
        layer.events.onInputUp.add(this.getCoordinates, this);
        */
        Client.sendNewUser();
    },

    getCoordinates: function(layer,pointer)
    {
        Client.sendClick(pointer.worldX,pointer.worldY);
    },

    addNewUser: function(id,x,y)
    {
        this.user_map[id] = game.add.sprite(x,y,'sprite');
    },

    moveUser: function(id,x,y)
    {
        var user = this.user_map[id];
        var distance = Phaser.Math.distance(user.x,user.y,x,y);
        var tween = game.add.tween(user);
        var duration = distance*10;
        tween.to({x:x,y:y}, duration);
        tween.start();
    },
    updateMarker: function() 
    {
        marker.x = currentLayer.getTileX(game.input.activePointer.worldX) * 32;
        marker.y = currentLayer.getTileY(game.input.activePointer.worldY) * 32;

        if (game.input.mousePointer.isDown)
        {
            this.map.putTile(currentTile, currentLayer.getTileX(marker.x), currentLayer.getTileY(marker.y), currentLayer);
            // map.fill(currentTile, currentLayer.getTileX(marker.x), currentLayer.getTileY(marker.y), 4, 4, currentLayer);
        }

    },
    createTileSelector: function() 
    {
        //  Our tile selection window
        var tileSelector = game.add.group();

        var tileSelectorBackground = game.make.graphics();
        tileSelectorBackground.beginFill(0x000000, 0.5);
        tileSelectorBackground.drawRect(0, 0, 800, 34);
        tileSelectorBackground.endFill();

        tileSelector.add(tileSelectorBackground);

        var tileStrip = tileSelector.create(1,1, 'ground_1x1');
        tileStrip.inputEnabled = true;
        tileStrip.events.onInputDown.add(this.pickTile, this);

        tileSelector.fixedToCamera = true;

        //  Our painting marker
        marker = game.add.graphics();
        marker.lineStyle(2, 0x000000, 1);
        marker.drawRect(0, 0, 32, 32);

    },
    pickTile: function(sprite, pointer) 
    {
        currentTile = game.math.snapToFloor(pointer.x, 32) / 32;
    },
    handleInput: function()
    {
        if (this.cursors.left.isDown)
        {
            game.camera.x-=5;
        }
        else if (this.cursors.right.isDown)
        {
            game.camera.x+=5;
        }

        if (this.cursors.up.isDown)
        {
            game.camera.y-=5;
        }
        else if (this.cursors.down.isDown)
        {
            game.camera.y+=5;
        }
    },
    update: function()
    {
        this.handleInput();
        this.updateMarker();
        //game.debug.text('1-3 Switch Layers. SPACE = Show All. Cursors = Move Camera', 16, 570);
        //map.update();
    },

    removeUser: function(id)
    {
        this.user_map[id].destroy();
        delete this.user_map[id];
    }

};

