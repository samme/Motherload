var Motherload = Motherload || {};

Motherload.Boot = function(){};

//setting game configuration and loading the assets for the loading screen
Motherload.Boot.prototype = {
  preload: function() {
  	
  },
  create: function() {
  	// loading screen will have a white background
  	// this.game.stage.backgroundColor = '#fff';

    // scaling options
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

	// physics system for movement
	this.game.physics.startSystem(Phaser.Physics.ARCADE);
    
    this.state.start('Preload');
  }
};
