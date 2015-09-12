//
// Initialize game
//
var GAME_WIDTH = 1280;
var GAME_HEIGHT = 720;
var game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, 'game');

//
// TODO: Clean these up into different files
//

// Boot State Class
var BootState = function() {};
BootState.prototype.create = function() {
    game.state.start('load');
};

// Loading State Class
var LoadState = function() {};
LoadState.prototype.preload = function() {
    game.add.text(80, 150, 'loading...', { font: '30px Courier', fill: '#ffffff'});
};
LoadState.prototype.create = function() {
    game.state.start('menu');
};

// Game Menu State Class
var MenuState = function() {};
MenuState.prototype.preload = function() {
    game.load.spritesheet('ss_static', 'img/ss_static.png', 1282, 720);
    game.load.image('img_freddy', 'img/img_freddy.png');
};
MenuState.prototype.create = function() {
    // Add background
    var bg = game.add.sprite(0, 0, 'ss_static');
    bg.animations.add('static');
    bg.animations.play('static', 30, true);

    // Title
    game.add.text(80, 80, "Five Nights at Leo's", { font: '84px VT323', fill: '#ffffff'});

    // Freddy
    var freddy = game.add.sprite(800, 0, 'img_freddy');

    // Actions
    var startBtn = game.add.text(80, game.world.height-160, 'START GAME', { font: '45px VT323', fill: '#ffffff'});
    startBtn.inputEnabled = true;
    startBtn.events.onInputDown.add(function() {
        game.state.start('play');
    });
    startBtn.events.onInputOver.add(function() {
        startBtn.fill = '#ff0000';
    });
    startBtn.events.onInputOut.add(function() {
        startBtn.fill = '#ffffff';
    });
};

// Game Play State Class
var PlayState = function() {};
PlayState.prototype.init = function() {
    this.camera = 0;
}
PlayState.prototype.preload = function() {
    game.load.image('img_office',    'img/img_office.png');
    game.load.image('img_mapclick',  'img/img_mapclick.png');
    game.load.image('img_map',       'img/img_map.png');
    game.load.image('img_map_panel', 'img/img_map_panel.png');
    game.load.image('img_room1',     'img/img_room1.png');
    game.load.image('img_cam1_text', 'img/img_cam1_text.png');
};

PlayState.prototype.addOffice = function() {
    // Background
    var bg = game.add.sprite(0, 0, 'img_office');
    bg.x = (game.width - bg.width) / 2;

    // Prevent certain key events from propagating to the browser
    game.input.keyboard.addKeyCapture([
        Phaser.Keyboard.LEFT,
        Phaser.Keyboard.RIGHT
    ]);

    // Add keyboard handlers
    game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
        .onHoldCallback = function() {
            if(bg.x + bg.width >= game.width) bg.x = bg.x - 2;
        };
    game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
        .onHoldCallback = function() {
            if(bg.x <= 0) bg.x = bg.x + 2;
        };
};

PlayState.prototype.addMap = function() {
    var self = this;

    // Add button to open map and cameras
    var mapBtn = game.add.sprite(GAME_WIDTH - 92, GAME_HEIGHT/2 - 140, 'img_mapclick');
    mapBtn.inputEnabled = true;

    // Add camera map on the panel
    var mapPanel = game.add.sprite(GAME_WIDTH - 873, GAME_HEIGHT/2 - 340, 'img_map_panel');
    mapPanel.inputEnabled = true;
    mapPanel.visible = false;

    // Load rooms
    var rooms = [
        game.add.sprite(GAME_WIDTH - 854, GAME_HEIGHT/2 - 326, 'img_room1')
    ];
    rooms[0].visible = false;

    // Add map
    var map = game.add.sprite(GAME_WIDTH - 420, GAME_HEIGHT - 400, 'img_map');
    map.visible = false;

    // Add cameras
    var cams = [
        game.add.sprite(map.x, map.y, 'img_cam1_text')
    ];
    cams[0].visible = false;

    // If map "Click" button is pressed, then show map panel
    mapBtn.events.onInputDown.add(function() {
        mapPanel.visible = !mapPanel.visible;
        map.visible = !map.visible; 
        rooms[self.camera].visible = !rooms[self.camera].visible;
        cams[0].visible = cams[0].visible;
    });

    // If map Panel is clicked, then hide map panel
    mapPanel.events.onInputDown.add(function() {
        mapPanel.visible = !mapPanel.visible;
        map.visible = !map.visible; 
        rooms[self.camera].visible = !rooms[self.camera].visible;
        cams[0].visible = cams[0].visible;
    });
};

PlayState.prototype.create = function() {
    this.addOffice();
    this.addMap();

    // Add text instructions
    game.add.text(80, 80, 'Press "X" to win', { font: '50px Arial', fill: '#ffffff'});
    game.input.keyboard.addKey(Phaser.Keyboard.X)
        .onDown.addOnce(this.win, this);

    // Add ESC to quit
    game.input.keyboard.addKey(Phaser.Keyboard.ESC)
        .onDown.addOnce(this.quit, this);
};
PlayState.prototype.win = function() {
    game.state.start('end');
};
PlayState.prototype.quit = function() {
    game.state.start('menu');
};

// End State Class
var EndState = function() {};
EndState.prototype.create = function() {
    game.add.text(80, 80, 'You Won!', { font: '50px Arial', fill: '#00ff00'});
    game.add.text(80, game.world.height-80, 'Press "R" to start', { font: '25px Arial', fill: '#ffffff'});
    game.input.keyboard.addKey(Phaser.Keyboard.R)
        .onDown.addOnce(this.restart, this);
};
EndState.prototype.restart = function() {
    game.state.start('menu');
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