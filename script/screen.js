var config = {
    type: Phaser.AUTO,
    width: 1400,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload (){
    this.load.image('sky', '../assets/sky.png');
    this.load.image('star', '../assets/star.png');
    this.load.image('pared', '../assets/pared.png');
    this.load.spritesheet('p1', '../assets/amarillo.png',
    { frameWidth: 32, frameHeight: 48 }
);

}

function create (){
    this.add.image(400, 300, 'sky');
    platforms = this.physics.add.staticGroup();
    
    platforms.create(700, 575, 'pared').setScale(2).refreshBody();

    
    platforms.create(600, 400, 'pared');
    platforms.create(50, 250, 'pared');
    platforms.create(750, 120, 'pared');

    

}

function update ()
{
}