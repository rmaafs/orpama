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
    this.load.image('star', '../assets/moneda.png');
    this.load.image('pared', '../assets/pared.png');
    this.load.image('bomb', '../assets/moneda.png');
    this.load.image('marcador', '../assets/marcador.png');
    this.load.spritesheet('p1', '../assets/naranja.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('p2', '../assets/rojo.png', { frameWidth: 32, frameHeight: 32 });
}

function create (){
    var personaje = 'p1';b = 7;
    var p = 32;

    if(b === 0){
        personaje = 'p2';
    }

    //Poner el fondo
    this.add.image(400, 300, 'sky');
    
    //Poner las plataformas en la pantalla
    platforms = this.physics.add.staticGroup();
    platforms.create(0, 0, 'marcador').setScale(2).refreshBody();
    platforms.create(700, 575, 'pared').setScale(2).refreshBody();
    platforms.create(450, 450, 'pared');
    platforms.create(900, 450, 'pared');
    platforms.create(150, 325, 'pared');
    platforms.create(1200, 325, 'pared');
    platforms.create(700, 200, 'pared');

    //Poner el jugador en pantalla
    player = this.physics.add.sprite(0, 500, personaje);
    player.setBounce(.65);
    player.setCollideWorldBounds(true);
    
    //Crea las animaciones del pacman
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers(personaje, { start: 2, end: 3 }),
        frameRate: p,
        repeat: -1
    });
    
    this.anims.create({
        key: 'turn',
        frames: this.anims.generateFrameNumbers(personaje, { start: 4, end: 5 }),
        frameRate: p,
        repeat: -1
    });
    
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers(personaje, { start: 0, end: 1 }),
        frameRate: p,
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
        score++;
        datos = "Jugador: ";
        datos += p1;
        datos += "      Vidas: "
        datos += v1;
        datos += "      Puntos:";
        datos += score;
        scoreText.setText(datos);

        if (stars.countActive(true) === 0){
            stars.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            });
        }else if(score % 5 === 0){
            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            var bomb = bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        }
    }

    //Bombas
    bombs = this.physics.add.group();
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, hitBomb, null, this);

    function hitBomb (player, bomb){
        //v1--;
        //console.log(v1);
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
        gameOver = true;
    }

    p1 = "Paco";
    v1 = 3;
    score = 0;    

    //Marcadores
    datos = "Jugador: ";
    datos += p1;
    datos += "      Vidas: "
    datos += v1;
    datos += "      Puntos:";
    datos += score;

    var scoreText;
    scoreText = this.add.text(16, 16, datos, { fontSize: '32px', fill: '#ffffff' });
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