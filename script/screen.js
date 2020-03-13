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
        update: update
    }
};

var game = new Phaser.Game(config);

function preload (){
    this.load.image('sky', '../assets/sky.png');
    this.load.image('star', '../assets/star.png');
    this.load.image('pared', '../assets/pared.png');
    this.load.spritesheet('p1', '../assets/naranja.png', { frameWidth: 15, frameHeight: 15 });
    this.load.spritesheet('p2', '../assets/azul.png', { frameWidth: 15, frameHeight: 15 });
    this.load.image('bombs', '../assets/bomb.png');

}

function create (){
    var personaje = 'p1';b = 10;
    if(b === 0){
        personaje = 'p2';
    }
    this.add.image(400, 300, 'sky');//Poner el fondo

    //Poner las plataformas en la pantalla
    platforms = this.physics.add.staticGroup();
    platforms.create(700, 575, 'pared').setScale(2).refreshBody();
    platforms.create(600, 400, 'pared');
    platforms.create(50, 250, 'pared');
    platforms.create(750, 120, 'pared');

    //Poner el jugador en pantalla
    player = this.physics.add.sprite(20, 20, personaje);
    player.setBounce(.75);
    player.setCollideWorldBounds(true);
    
    //Crea las animaciones del pacman
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers(personaje, { start: 2, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    
    this.anims.create({
        key: 'turn',
        frames: this.anims.generateFrameNumbers(personaje, { start: 6, end: 7 }),
        frameRate: 10,
        repeat: -1
    });
    
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers(personaje, { start: 0, end: 1 }),
        frameRate: 10,
        repeat: -1
    });

    //Agrega fisica al jugador
    player.body.setGravityY(300);
    this.physics.add.collider(player, platforms);

    //Crea el grupo de estellas
    stars = this.physics.add.group({
        key: 'star',
        repeat: 19,
        setXY: { x: 12, y: 0, stepX: 70 }
    });
    
    stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    //Configura las colisiones de las estrellas
    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);
    
    function collectStar (player, star){
        star.disableBody(true, true);

        //Sumar puntos
        score += 1;
        scoreText.setText('Estrellas: ' + score);

        if (stars.countActive(true) === 0)    {
        
        }
    }

    //Marcadores
    var score = 0;
    var scoreText;
    scoreText = this.add.text(16, 16, 'Estrellas: 0', { fontSize: '32px', fill: '#255' });
}

function update (){
    //Se encarga de mover el personaje
    cursors = this.input.keyboard.createCursorKeys();
    if (cursors.left.isDown){
        player.setVelocityX(-160);
        player.anims.play('left', true);
    }else if (cursors.right.isDown){
        player.setVelocityX(160);
        player.anims.play('right', true);
    }else{
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down){
        player.setVelocityY(-430);
    }
    
}
