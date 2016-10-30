var Motherload = Motherload || {};

Motherload.Game = function(){};

Motherload.Game.prototype = {
  create: function() {

    game = this;
    digging = false;
    digging_horizontal = false;
    digging_vertical = false;

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
    this.hero.body.gravity.y = 10000;
    this.hero.body.collideWorldBounds = true;
    // Set camera to follow hero
    this.camera.follow(this.hero);

    // Add ground group
    this.ground = this.add.group();
    this.ground.enableBody = true;
    var ground_options = [
      "dirt",
      "ore"
    ];

    // Generate ground blocks
    var row = 0;

    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            // Set ground_options to number of options plus 3, and then set the undefined to dirt to ensure an abundance of dirt
            var ground_option = ground_options[Math.floor(Math.random() * (ground_options.length + 3))];
            if (ground_option == null) {
              ground_option = ground_options[0];
            }
            this.ground_block = this.ground.create(64 * j, 480 + (64 * row), ground_option);
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

    this.game.physics.arcade.collide(this.hero, this.ground, this.dig_prep);
    if (!digging) {
    
      // Allow hero to phase through ground when digging
      this.hero.body.velocity.x = 0;
      this.hero.body.velocity.y = 0;

      if (this.cursors.up.isDown)
      {
          this.hero.body.velocity.y = -350;
      }
      else if (this.cursors.down.isDown)
      {
          this.hero.body.velocity.y = 350;
      }

      if (this.cursors.left.isDown)
      {
          this.hero.body.velocity.x = -350;
      }
      else if (this.cursors.right.isDown)
      {
          this.hero.body.velocity.x = 350;
      }

    }
  },
  render: function() {

    this.game.debug.cameraInfo(this.camera, 32, 32);
    this.game.debug.spriteCoords(this.hero, 32, 500);
    this.game.debug.text(this.game.time.fps, 400, 20, "#fff");
  },
  dig_prep: function(hero, ground_block) {
    if (game.cursors.down.isDown && hero.body.touching.down && !digging) {
      digging = true;
      digging_vertical = true;
      game.dig(ground_block, "down");
    }
    else if (game.cursors.left.isDown && hero.body.touching.left && !digging) {
      digging = true;
      digging_horizontal = true;
      game.dig(ground_block, "left");
    }
    else if (game.cursors.right.isDown && hero.body.touching.right && !digging) {
      digging = true;
      digging_horizontal = true;
      game.dig(ground_block, "right");
    }
  },
  dig: function(ground_block, direction) {
    // set to ground tile number (left is 0, next is 1 etc)
    var hero_tile_position = Math.round(this.hero.position.x / 64);
      
    if (direction == "down") {
      // Stop digging side to side
      if (this.hero.position.y < ground_block.position.y) {
        // Only dig through block directly underneath (stops diagonal bug)
        // if (ground_block.position.x == hero_tile_position * 64) {
          dig_movement(direction);
        // }
        // else {
        //   end_dig();
        // }
      }
      else {
        end_dig();
      }
    }

    if (direction == "left" || direction == "right") {
      // Ensure hero is on ground (body.touching returns true when not)
      var block_underneath_hero = false;
      for (var i=0; i < this.ground.children.length; i++) {
        if (this.ground.children[i].position.x == hero_tile_position * 64
          && this.ground.children[i].position.y == this.hero.position.y + 32) {
          block_underneath_hero = true;
        }
      }
      if(block_underneath_hero) {
        dig_movement(direction);
      }
      else {
        end_dig();
      }
    }
    function dig_movement(direction) {
      // Allow phasing through ground
      if (direction == 'down') {
        var array = game.ground.children;
        // phase diagonally if not exactly on top of block
        for (var i = 0; i < array.length; i++) {
          if (array[i].position.y == game.hero.position.y + 32 && 
            (array[i].position.x == hero_tile_position * 64 || 
             array[i].position.x == hero_tile_position * 64 - 64 )) {
            array[i].body.enable = false;
          }
        }
      }
      else {
        ground_block.body.enable = false;
      }
      // stop hero from falling through
      game.hero.body.gravity.y = 0;
      // Stop hero sliding if holding down left or right at same time as down
      // and move hero slower through ground whilst it fades
      if (direction == 'down') {
        game.hero.body.velocity.x = 0;
        game.hero.body.velocity.y += 10;
        // Move hero to the middle of the block
        game.add.tween(game.hero).to({x: ground_block.body.position.x + 16}, 700, Phaser.Easing.Linear.None, true);
      }
      else if (direction == 'left') {
        game.hero.body.velocity.x -= 55;
      }
      else {
        game.hero.body.velocity.x += 55;
      }
      // move hero slower through ground whilst it fades
      game.hero.body.velocity.y += 40;
      // Fade ground_block out
      var tween = game.add.tween(ground_block).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
      tween.onComplete.add(function() {
        ground_block.destroy();
        if (direction == 'down') {
          for (var i = 0; i < array.length; i++) {
            array[i].body.enable = true;
          }
        }
        if (direction != 'down') {
          game.hero.body.velocity.x = 0;
        }
        digging = false;
        // reset hero's gravity back to normal
        game.hero.body.gravity.y = 10000;
      });
    }
    function end_dig() {
      digging = false;
      digging_vertical = false;
    }
  }
};