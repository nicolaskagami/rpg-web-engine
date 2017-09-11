
var game = new Phaser.Game(48*32, 24*32, Phaser.AUTO, document.getElementById('game'));
var Game = new GameFunction;
game.state.add('Game',Game);
game.state.start('Game');
