var config = {
    type: Phaser.AUTO,
    width: 1350,
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
    }
};
var game = new Phaser.Game(config);

function preload(){
    this.load.setPath("./assets");
    this.load.image("menu","../assets/menu.jpg");
    this.load.image("pcmn","../assets/pcmn.png");
}
function create(){
    this.add.image(400,300, "menu");
    this.add.image(1050,300, "pcmn");
    this.texto = this.add.text(200,100, 'PACMAN', {
        fontSize: '80px',
        fill: '#ffffff'
    });
    this.texto = this.add.text(200,400, 'PRESS START BUTTON', {
        fontSize: '40px',
        fill: '#ffffff'
    }).setInteractive();
    this.texto.on('pointerdown', () => {
        this.scene.start('');
    });
    this.texto = this.add.text(200,475, 'RECORDS', {
        fontSize: '40px',
        fill: '#ffffff'
    }).setInteractive();
    this.texto.on('pointerdown', () => {
        this.scene.start('');
    });
    
}


