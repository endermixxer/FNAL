//
// Initialize game
//
var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'game');

//
// TODO: Clean these up into different files
//
var BootState = {
    create: function() {
        game.state.start('load');
    }
};
var LoadState = {
    preload: function() {
        game.add.text(80, 150, 'loading...', { font: '30px Courier', fill: '#ffffff'});
        // Load images here
    },
    create: function() {
        game.state.start('menu');
    }
};
var MenuState = {
    preload: function() {
        game.load.spritesheet('bg_static', 'img/ss_static.png', 1282, 720);
        game.load.image('img_freddie', 'img/img_freddy.png');
    },
    create: function() {
        // Add background
        var bg = game.add.sprite(0, 0, 'bg_static');
        bg.scale.setTo(game.width / bg.width , game.height / bg.height);
        bg.animations.add('static');
        bg.animations.play('static', 30, true);

        // Title
        game.add.text(80, 80, "Five Nights at Leo's", { font: '84px VT323', fill: '#ffffff'});

        // Freddie
        var freddie = game.add.sprite(800, 0, 'img_freddie');
        freddie.scale.setTo(game.height / freddie.height, game.height / freddie.height);

        // Actions
        var startButton = game.add.text(80, game.world.height-160, 'START GAME', { font: '45px VT323', fill: '#ffffff'});
        startButton.inputEnabled = true;
        startButton.events.onInputDown.add(function() {
            game.state.start('play');
        });
        startButton.events.onInputOver.add(function() {
            startButton.fill = '#ff0000';
        });
        startButton.events.onInputOut.add(function() {
            startButton.fill = '#ffffff';
        });

    }
};
var PlayState = {
    preload: function() {
        game.load.image('img_office', 'img/img_office.png');
    },
    create: function() {
        // Background
        var bg = game.add.sprite(0, 0, 'img_office');
        bg.scale.setTo(game.height / bg.height, game.height / bg.height);
        bg.x = (game.width - bg.width) / 2;

        // Prevent certain key events from propagating to the browser
        game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT
        ]);

        // Add keyboard handlers
        game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
            .onHoldCallback = function() {
                if(bg.x + bg.width >= game.width) bg.x = bg.x - 1;
            };
        game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
            .onHoldCallback = function() {
                if(bg.x <= 0) bg.x = bg.x + 1;
            };

        // Add text instructions
        game.add.text(80, 80, 'Press "X" to win', { font: '50px Arial', fill: '#ffffff'});
        game.input.keyboard.addKey(Phaser.Keyboard.X)
            .onDown.addOnce(this.win, this);
    },
    win: function() {
        game.state.start('end');
    }
};
var EndState = {
    create: function() {
        game.add.text(80, 80, 'You Won!', { font: '50px Arial', fill: '#00ff00'});
        game.add.text(80, game.world.height-80, 'Press "R" to start', { font: '25px Arial', fill: '#ffffff'});
        game.input.keyboard.addKey(Phaser.Keyboard.R)
            .onDown.addOnce(this.restart, this);
    },
    restart: function() {
        game.state.start('menu');
    }
};

//
// Define game states
//
game.state.add('boot', BootState);
game.state.add('load', LoadState);
game.state.add('menu', MenuState);
game.state.add('play', PlayState);
game.state.add('end',  EndState);

//
// Start by booting up the game
//
game.state.start('boot');