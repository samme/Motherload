var Motherload = Motherload || {};

Motherload.Game = function(){};

Motherload.Game.prototype = {
  create: function() {

    this.world.setBounds(0, 0, 640, 2000);

    this.physics.startSystem(Phaser.Physics.P2JS);

    // Add sky
    this.sky = this.add.sprite(0, 0, 'sky');
    this.sky.height = 480;
    
    // Add hero sprite
    this.hero = this.add.sprite(this.world.centerX, 465, 'hero');
    // Create animation
    this.hero.animations.add('run', [1, 2, 3, 0]);
    this.hero.animations.play('run', 5, true);

    // this.physics.arcade.enable(this.hero);
    // this.hero.enableBody = true;

    this.ground = this.add.tilemap();
    this.ground.addTilesetImage('ore','ore', 32, 32, null, null, 0);
    this.layer0 = this.ground.create('layer0', 640, 640, 32, 32);

    // for (var i=0; i<100; i++) {
    //     for(var j=0; j<100; j++) {
    //         this.ground.putTile(this.ground[ore],i,j,this.layer0);
    //     }
    // }

    this.physics.p2.enable(this.hero);
    cursors = this.input.keyboard.createCursorKeys();
    this.camera.follow(this.hero);

  },
  update: function() {
    this.hero.body.setZeroVelocity();
    if (cursors.up.isDown)
    {
        this.hero.body.moveUp(300)
    }
    else if (cursors.down.isDown)
    {
        this.hero.body.moveDown(300);
    }

    if (cursors.left.isDown)
    {
        this.hero.body.velocity.x = -300;
    }
    else if (cursors.right.isDown)
    {
        this.hero.body.moveRight(300);
    }
  },
  render: function() {

    this.game.debug.cameraInfo(this.camera, 32, 32);
    this.game.debug.spriteCoords(this.hero, 32, 500);
  }
};