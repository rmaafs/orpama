var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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
    this.load.spritesheet('p1', 
    '../assets/amarillo.png',
    { frameWidth: 32, frameHeight: 48 }
);

}

function create (){
    this.add.image(400, 300, 'sky');
    platforms = this.physics.add.staticGroup();
    
    


    this.add.image(10,10, 'star');
    this.add.image(50,50, 'star');

}

function update ()
{
}