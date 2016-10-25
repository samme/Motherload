var Motherload = Motherload || {};

Motherload.Game = function(){};

Motherload.Game.prototype = {
  create: function() {

    game = this;
    digging = false;

    this.world.setBounds(0, 0, 640, 3000);

    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    // Add sky
    this.sky = this.add.sprite(0, 0, 'sky');
    this.sky.height = 480;
    
    // Add hero sprite
    this.hero = this.add.sprite(100, 435, 'hero');
    // Create animation
    this.hero.animations.add('run', [1, 2, 3, 0]);
    this.hero.animations.play('run', 5, true);

    // Set hero physics
    this.game.physics.arcade.enable(this.hero);
    this.hero.body.gravity.y = 300;
    this.hero.body.collideWorldBounds = true;
    // Set camera to follow hero
    this.camera.follow(this.hero);

    // Add ground group
    this.ground = this.add.group();
    this.ground.enableBody = true;

    // TODO figure out how to generate sprites randomly
    // Generate random number between (1 and 2) and set 1 to one block and 2 to another? See Math.Random
    var row = 0;

    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            var number = Math.floor(Math.random() * 2);
            console.log(number);
            this.ore = this.ground.create(64 * j, 480 + (64 * row), 'ore');
            var last = this.ground.length - 1;
            var child = this.ground.children[last];
            child.width = 64;
            child.height = 64;
            child.body.immovable = true;
        }
        row++;
    }

    this.cursors = this.input.keyboard.createCursorKeys();

    // debugging
    this.game.time.advancedTiming = true;

  },
  update: function() {
    this.game.physics.arcade.collide(this.hero, this.ground, this.dig);
    this.hero.body.velocity.x = 0;
    if (this.cursors.left.isDown)
    {
        this.hero.body.velocity.x = -350;
    }
    else if (this.cursors.right.isDown)
    {
        this.hero.body.velocity.x = 350;
    }
  },
  render: function() {

    this.game.debug.cameraInfo(this.camera, 32, 32);
    this.game.debug.spriteCoords(this.hero, 32, 500);
    this.game.debug.text(this.game.time.fps, 400, 20, "#fff");
  },
  dig: function(hero, ore) {
    if (game.cursors.down.isDown && digging == false) {
      digging = true;
      //TODO stop corner blocks from disappearing when holding left / right down
      console.log("hero: " + hero.position.x);
      console.log("ore: " + ore.position.x);
      console.log(hero.position.x - ore.position.x);
      
      if (hero.position.y < ore.position.y) {
        var tween = game.add.tween(ore).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(function() {
          ore.destroy();
          digging = false;
        });
      }
    }
  }
};