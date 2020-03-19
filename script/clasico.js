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
var teclas;

function preload (){
    this.load.image('sky', '../assets/sky.png');
    this.load.image('star', '../assets/moneda.png');
    this.load.image('pared', '../assets/pared.png');
    this.load.image('bomb', '../assets/cereza.png');
    this.load.image('marcador', '../assets/marcador.png');
    this.load.spritesheet('p1', '../assets/naranja.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('p2', '../assets/rojo.png', { frameWidth: 32, frameHeight: 32 });
    this.load.image('e1', '../assets/p1.png');
    this.load.image('e2', '../assets/p2.png');

    this.load.audio('intro', ['../assets/sounds/intro.mp3']);
    this.load.audio('death', ['../assets/sounds/death.mp3']);
    this.load.audio('comer_fantasma', ['../assets/sounds/comer_fantasma.mp3']);
    this.load.audio('comer_fruta', ['../assets/sounds/comer_fruta.mp3']);
    this.load.audio('waka', ['../assets/sounds/waka.mp3']);
}

function create (){
    this.intro = this.sound.add('intro');
    this.death = this.sound.add('comer_fruta');
    this.comerFantasma = this.sound.add('comer_fantasma');
    this.comerFruta = this.sound.add('comer_fruta');
    this.waka = this.sound.add('waka');

    this.intro.play();

    var personaje = 'p1';b = 0;
    var p = 32;
    p1 = "Paco";
    v1 = 3;
    score = 0;

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

    //Configura las colisiones de las estrellas
    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);
    
    function collectStar (player, star){
        star.disableBody(true, true);
        this.waka.play();

        //Sumar puntos
        score++;
        datos = "Jugador: ";
        datos += p1;
        datos += "      Vidas: "
        datos += v1;
        datos += "      Puntos:";
        datos += score;
        datos += "      Nivel: Clasico"
        scoreText.setText(datos);

        if (stars.countActive(true) === 0){
            this.death.play();
            stars.children.iterate(function (child) {
                var x = (player.y < 400) ? 500 : 100;
                child.enableBody(true, child.x, x, true, true);
            });
        }else if(score % 5 === 0){
            this.comerFantasma.play();
            var bomb = bombs.create(Phaser.Math.Between(50, 1300), Phaser.Math.Between(50, 500), 'bomb');            
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        }else if(score % 9 === 0){
            if(Phaser.Math.Between(0, 1)){
                console.log('nuevo pacman');
            }
        }else if(score % 13 === 0){
            if(Phaser.Math.Between(0, 1)){
                console.log('nuevo pacman2');
            }
        }
    }

    //Bombas
    bombs = this.physics.add.group();
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, hitBomb, null, this);

    function hitBomb (player, bomb){
        this.comerFruta.play();

        v1--;
        datos = "Jugador: ";
        datos += p1;
        datos += "      Vidas: "
        datos += v1;
        datos += "      Puntos:";
        datos += score;
        datos += "      Nivel: Clasico"
        scoreText.setText(datos);
        if(v1 == 0){
            this.sound.add('death').play();
            this.physics.pause();
            player.setTint(0xff0000);
            player.anims.play('turn');
            gameOver = true;
        }else{
            bomb.disableBody(true, true);
        }
    }

    //Marcadores
    datos = "Jugador: ";
    datos += p1;
    datos += "      Vidas: "
    datos += v1;
    datos += "      Puntos:";
    datos += score;
    datos += "      Nivel: Clasico"
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

    //Finalizar partida
    this.input.keyboard.on('keyup_SPACE', (event)=>{
        console.log("espacio");
    });

    //Pausa
    this.input.keyboard.on('keyup_ESC', (event)=>{
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
        gameOver = true;
    });

    //Activar/Desactivar sonido
    this.input.keyboard.on('keyup_BACKSPACE', (event)=>{
        console.log("atras");
    });
}