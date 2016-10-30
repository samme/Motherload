var Motherload = Motherload || {};

//Motherload.game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO, '');
Motherload.game = new Phaser.Game(800, 640, Phaser.CANVAS, '');

Motherload.game.state.add('Boot', Motherload.Boot);
Motherload.game.state.add('Preload', Motherload.Preload);
Motherload.game.state.add('MainMenu', Motherload.MainMenu);
Motherload.game.state.add('Game', Motherload.Game);
Motherload.game.state.add('GameOver', Motherload.GameOver);

Motherload.game.state.start('Boot');
