var Motherload = Motherload || {};

//loading the game assets
Motherload.Preload = function(){};

Motherload.Preload.prototype = {
  preload: function() {
    this.load.image('sky', 'assets/images/sky.png');
    this.load.spritesheet('hero', 'assets/images/hero.png', 32, 32);
    this.load.image('ore', 'assets/images/ore.jpg')
  },
  create: function() {
    this.state.start('Game');
  }
};