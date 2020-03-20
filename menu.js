class SceneClasico extends Phaser.Scene {

    constructor() {
        super({ key: 'SceneClasico' });
        this.b = 0;
        this.player;
    }

    preload() {
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

    create() {
        this.intro = this.sound.add('intro');
        this.death = this.sound.add('comer_fruta');
        this.comerFantasma = this.sound.add('comer_fantasma');
        this.comerFruta = this.sound.add('comer_fruta');
        this.waka = this.sound.add('waka');

        this.intro.play();

        var personaje = 'p1';
        var b = 0;
        var p = 32;
        var p1 = "Rodrigo";
        var v1 = 3;
        var score = 0;
        var gameOver = false;

        if (b === 0) {
            personaje = 'p2';
        }

        //Poner el fondo
        this.add.image(400, 300, 'sky');

        //Poner las plataformas en la pantalla
        var platforms = this.physics.add.staticGroup();
        platforms.create(0, 0, 'marcador').setScale(2).refreshBody();
        platforms.create(700, 575, 'pared').setScale(2).refreshBody();
        platforms.create(450, 450, 'pared');
        platforms.create(900, 450, 'pared');
        platforms.create(150, 325, 'pared');
        platforms.create(1200, 325, 'pared');
        platforms.create(700, 200, 'pared');

        //Poner el jugador en pantalla
        this.player = this.physics.add.sprite(0, 500, personaje);
        var player = this.player;
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
        var stars = this.physics.add.group({
            key: 'star',
            repeat: 19,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        //Crea el grupo de pacman
        var e1 = this.physics.add.group({
            key: 'e1',
            repeat: 0,
            setXY: { x: Phaser.Math.Between(50, 1300), y: Phaser.Math.Between(100, 450), stepX: 70 }
        });

        var e2 = this.physics.add.group({
            key: 'e2',
            repeat: 0,
            setXY: { x: Phaser.Math.Between(50, 1300), y: Phaser.Math.Between(100, 450), stepX: 70 }
        });

        //Configura las colisiones de las estrellas
        this.physics.add.collider(stars, platforms);
        this.physics.add.overlap(player, stars, collectStar, null, this);
        this.physics.add.collider(e1, platforms);
        this.physics.add.collider(e2, platforms);
        this.physics.add.overlap(player, e1, sE1, null, this);
        this.physics.add.overlap(player, e2, sE2, null, this);
        this.physics.add.collider(stars, platforms);

        function sE1(player, e1) {
            e1.disableBody(true, true);
            this.waka.play();
            score += 10;
            datos = "Jugador: ";
            datos += p1;
            datos += "      Vidas: "
            datos += v1;
            datos += "      Puntos:";
            datos += score;
            datos += "      Nivel: Acarde";
            scoreText.setText(datos);
        }

        function sE2(player, e2) {
            e2.disableBody(true, true);
            this.waka.play();
            score += 15;
            datos = "Jugador: ";
            datos += p1;
            datos += "      Vidas: "
            datos += v1;
            datos += "      Puntos:";
            datos += score;
            datos += "      Nivel: Acarde";
            scoreText.setText(datos);
        }

        function collectStar(player, star) {
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

            if (stars.countActive(true) === 0) {
                this.death.play();
                stars.children.iterate(function (child) {
                    var x = (player.y < 400) ? 500 : 100;
                    child.enableBody(true, child.x, x, true, true);
                });
            } else if (score % 5 === 0) {
                this.comerFantasma.play();
                var bomb = bombs.create(Phaser.Math.Between(50, 1300), Phaser.Math.Between(50, 500), 'bomb');
                bomb.setBounce(1);
                bomb.setCollideWorldBounds(true);
                bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            } else if (score % 3 === 0) {
                if (Phaser.Math.Between(0, 1)) {
                    if (e1.countActive(true) === 0) {
                        this.death.play();
                        e1.children.iterate(function (child) {
                            var x = (player.y < 400) ? 300 : 50;
                            var y = (player.x < 600) ? 850 : 250;
                            child.enableBody(true, x, y, true, true);
                        });
                    }
                }
            } else if (score % 4 === 0) {
                if (Phaser.Math.Between(0, 1)) {
                    if (e2.countActive(true) === 0) {
                        this.death.play();
                        e2.children.iterate(function (child) {
                            var x = (player.y < 400) ? 300 : 50;
                            var y = (player.x < 600) ? 850 : 250;
                            child.enableBody(true, x, y, true, true);
                        });
                    }
                }
            }
        }

        //Bombas
        var bombs = this.physics.add.group();
        this.physics.add.collider(bombs, platforms);
        this.physics.add.collider(player, bombs, hitBomb, null, this);

        function hitBomb(player, bomb) {
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
            if (v1 == 0) {
                this.sound.add('death').play();
                this.physics.pause();
                player.setTint(0xff0000);
                player.anims.play('turn');
                gameOver = true;
                save(p1, score);
                this.scene.start('SceneGameOver');
            } else {
                bomb.disableBody(true, true);
            }
        }

        this.physics.add.collider(e1, bombs, hitBo, null, this);
        this.physics.add.collider(e2, bombs, hitBom, null, this);

        function hitBo(e1, bombs) {
            e1.disableBody(true, true);
            bombs.disableBody(true, true);
            this.comerFruta.play();
        }

        function hitBom(e2, bombs) {
            e2.disableBody(true, true);
            bombs.disableBody(true, true);
            this.comerFruta.play();
        }

        //Marcadores
        var datos = "Jugador: ";
        datos += p1;
        datos += "      Vidas: "
        datos += v1;
        datos += "      Puntos:";
        datos += score;
        datos += "      Nivel: Clasico"
        var scoreText;
        scoreText = this.add.text(16, 16, datos, { fontSize: '32px', fill: '#ffffff' });

        //Mute desactivado
        this.mute = false;

        //Finalizar partida
        this.input.keyboard.on('keyup_SPACE', (event) => {
            console.log("espacio");
        });

        //Pausa
        this.input.keyboard.on('keyup_ESC', (event) => {
            this.physics.pause();
            player.setTint(0xff0000);
            player.anims.play('turn');
            gameOver = true;
        });

        //Activar/Desactivar sonido
        this.input.keyboard.on('keyup_BACKSPACE', (event) => {
            this.mute = !this.mute;
            this.intro.mute = this.mute;
            this.death.mute = this.mute;
            this.comerFantasma.mute = this.mute;
            this.comerFruta.mute = this.mute;
            this.waka.mute = this.mute;
        });
    }

    update() {
        //Se encarga de mover el personaje
        var cursors = this.input.keyboard.createCursorKeys();
        if (cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        } else if (cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        if (cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-430);
        }
    }
    
    save(p1, score){
        var records = localStorage.getItem('records');
        records = JSON.parse(records);

        if(records == undefined){
            records = [];
        }
        var re = JSON.stringify({
            Jugador:p1,
            Puntos:score
        });

        records.push(re);
        localStorage.setItem("records", JSON.stringify(records));
    }
}

class SceneArcade extends Phaser.Scene {

    constructor() {
        super({ key: 'SceneArcade' });
    }

    preload() {
        this.load.image('sky', '../assets/sky.png');
        this.load.image('star', '../assets/moneda.png');
        this.load.image('pared', '../assets/pared.png');
        this.load.image('bomb', '../assets/cereza.png');
        this.load.image('pared2', '../assets/pared2.png');
        this.load.image('marcador', '../assets/marcador.png');
        this.load.spritesheet('p1', '../assets/naranja.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('p2', '../assets/rojo.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('e2', '../assets/p2.png');
        this.load.image('e1', '../assets/p1.png');

        this.load.audio('intro', ['../assets/sounds/intro.mp3']);
        this.load.audio('death', ['../assets/sounds/death.mp3']);
        this.load.audio('comer_fantasma', ['../assets/sounds/comer_fantasma.mp3']);
        this.load.audio('comer_fruta', ['../assets/sounds/comer_fruta.mp3']);
        this.load.audio('waka', ['../assets/sounds/waka.mp3']);
    }

    create() {
        this.intro = this.sound.add('intro');
        this.death = this.sound.add('comer_fruta');
        this.comerFantasma = this.sound.add('comer_fantasma');
        this.comerFruta = this.sound.add('comer_fruta');
        this.waka = this.sound.add('waka');

        this.intro.play();

        var personaje = 'p1';
        var b = 7;
        var p = 32;
        var p1 = "Paco";
        var v1 = 3;
        var score = 0;
        var gameOver = false;

        if (b === 0) {
            personaje = 'p2';
        }

        //Poner el fondo
        this.add.image(400, 300, 'sky');

        //Poner las plataformas en la pantalla
        var platforms = this.physics.add.staticGroup();
        platforms.create(0, 0, 'marcador').setScale(2).refreshBody();
        platforms.create(700, 575, 'pared').setScale(2).refreshBody();
        platforms.create(250, 450, 'pared2');
        platforms.create(950, 450, 'pared2');
        platforms.create(150, 300, 'pared2');
        platforms.create(500, 300, 'pared2');
        platforms.create(850, 300, 'pared2');
        platforms.create(1200, 300, 'pared2');
        platforms.create(0, 150, 'pared2');
        platforms.create(350, 150, 'pared2');
        platforms.create(750, 150, 'pared2');
        platforms.create(1100, 150, 'pared2');

        //Poner el jugador en pantalla
        this.player = this.physics.add.sprite(0, 500, personaje);
        var player = this.player;
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
        var stars = this.physics.add.group({
            key: 'star',
            repeat: 19,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        //Crea el grupo de pacman
        var e1 = this.physics.add.group({
            key: 'e1',
            repeat: 0,
            setXY: { x: Phaser.Math.Between(50, 1300), y: Phaser.Math.Between(100, 450), stepX: 70 }
        });

        var e2 = this.physics.add.group({
            key: 'e2',
            repeat: 0,
            setXY: { x: Phaser.Math.Between(50, 1300), y: Phaser.Math.Between(100, 450), stepX: 70 }
        });

        //Configura las colisiones de las estrellas
        this.physics.add.collider(stars, platforms);
        this.physics.add.collider(e1, platforms);
        this.physics.add.collider(e2, platforms);
        this.physics.add.overlap(player, stars, collectStar, null, this);
        this.physics.add.overlap(player, e1, sE1, null, this);
        this.physics.add.overlap(player, e2, sE2, null, this);

        function sE1(player, e1) {
            e1.disableBody(true, true);
            this.waka.play();
            score += 10;
            datos = "Jugador: ";
            datos += p1;
            datos += "      Vidas: "
            datos += v1;
            datos += "      Puntos:";
            datos += score;
            datos += "      Nivel: Acarde";
            scoreText.setText(datos);
        }

        function sE2(player, e2) {
            e2.disableBody(true, true);
            this.waka.play();
            score += 15;
            datos = "Jugador: ";
            datos += p1;
            datos += "      Vidas: "
            datos += v1;
            datos += "      Puntos:";
            datos += score;
            datos += "      Nivel: Acarde";
            scoreText.setText(datos);
        }

        function collectStar(player, star) {
            this.waka.play();

            star.disableBody(true, true);

            //Sumar puntos
            score++;
            datos = "Jugador: ";
            datos += p1;
            datos += "      Vidas: "
            datos += v1;
            datos += "      Puntos:";
            datos += score;
            datos += "      Nivel: Acarde";
            scoreText.setText(datos);

            if (stars.countActive(true) === 0) {
                this.death.play();
                stars.children.iterate(function (child) {
                    var x = (player.y < 400) ? 300 : 50;
                    child.enableBody(true, child.x, x, true, true);
                });
            } else if (score % 5 === 0) {
                this.comerFantasma.play();
                var bomb = bombs.create(Phaser.Math.Between(50, 1300), Phaser.Math.Between(50, 500), 'bomb');
                bomb.setBounce(1);
                bomb.setCollideWorldBounds(true);
                bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            } else if (score % 3 === 0) {
                if (Phaser.Math.Between(0, 1)) {
                    if (e1.countActive(true) === 0) {
                        this.death.play();
                        e1.children.iterate(function (child) {
                            var x = (player.y < 400) ? 300 : 50;
                            var y = (player.x < 600) ? 850 : 250;
                            child.enableBody(true, x, y, true, true);
                        });
                    }
                }
            } else if (score % 4 === 0) {
                if (Phaser.Math.Between(0, 1)) {
                    if (e2.countActive(true) === 0) {
                        this.death.play();
                        e2.children.iterate(function (child) {
                            var x = (player.y < 400) ? 300 : 50;
                            var y = (player.x < 600) ? 850 : 250;
                            child.enableBody(true, x, y, true, true);
                        });
                    }
                }
            }
        }

        //Bombas
        var bombs = this.physics.add.group();
        this.physics.add.collider(bombs, platforms);
        this.physics.add.collider(player, bombs, hitBomb, null, this);

        function hitBomb(player, bomb) {
            this.comerFruta.play();
            v1--;
            datos = "Jugador: ";
            datos += p1;
            datos += "      Vidas: "
            datos += v1;
            datos += "      Puntos:";
            datos += score;
            datos += "      Nivel: Acarde"
            scoreText.setText(datos);
            if (v1 == 0) {
                this.physics.pause();
                player.setTint(0xff0000);
                player.anims.play('turn');
                gameOver = true;
                save(p1, score);
                this.scene.start('SceneGameOver');
            } else {
                bomb.disableBody(true, true);
            }
        }

        this.physics.add.collider(e1, bombs, hitBo, null, this);
        this.physics.add.collider(e2, bombs, hitBom, null, this);

        function hitBo(e1, bombs) {
            e1.disableBody(true, true);
            bombs.disableBody(true, true);
            this.comerFruta.play();
        }

        function hitBom(e2, bombs) {
            e2.disableBody(true, true);
            bombs.disableBody(true, true);
            this.comerFruta.play();
        }

        //Marcadores
        var datos = "Jugador: ";
        datos += p1;
        datos += "      Vidas: "
        datos += v1;
        datos += "      Puntos:";
        datos += score;
        datos += "      Nivel: Clasico"
        var scoreText;
        scoreText = this.add.text(16, 16, datos, { fontSize: '32px', fill: '#ffffff' });

        //Mute desactivado
        this.mute = false;

        //Finalizar partida
        this.input.keyboard.on('keyup_SPACE', (event) => {
            console.log("espacio");
        });

        //Pausa
        this.input.keyboard.on('keyup_ESC', (event) => {
            this.physics.pause();
            player.setTint(0xff0000);
            player.anims.play('turn');
            gameOver = true;
        });

        //Activar/Desactivar sonido
        this.input.keyboard.on('keyup_BACKSPACE', (event) => {
            this.mute = !this.mute;
            this.intro.mute = this.mute;
            this.death.mute = this.mute;
            this.comerFantasma.mute = this.mute;
            this.comerFruta.mute = this.mute;
            this.waka.mute = this.mute;
        });
    }


    update() {
        //Se encarga de mover el personaje
        var cursors = this.input.keyboard.createCursorKeys();
        if (cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        } else if (cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        if (cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-430);
        }
    }
    
    save(p1, score){
        var records = localStorage.getItem('records');
        records = JSON.parse(records);

        if(records == undefined){
            records = [];
        }
        var re = JSON.stringify({
            Jugador:p1,
            Puntos:score
        });

        records.push(re);
        localStorage.setItem("records", JSON.stringify(records));
    }
}



class SceneMenu extends Phaser.Scene {

    constructor() {
        super({ key: 'SceneMenu' });
    }

    preload() {
        this.load.setPath("./assets");
        this.load.image("menu", "../assets/menu.jpg");
        this.load.image("pcmn", "../assets/pcmn.png");
    }
    create() {
        this.add.image(400, 300, "menu");
        this.add.image(1050, 300, "pcmn");
        this.texto = this.add.text(200, 100, 'PACMAN', {
            fontSize: '80px',
            fill: '#ffffff'
        });
        this.texto = this.add.text(200, 400, 'PRESS START BUTTON', {
            fontSize: '40px',
            fill: '#ffffff'
        }).setInteractive();
        this.texto.on('pointerdown', () => {
            this.scene.start('SceneSelector');
        });
        this.texto = this.add.text(200, 475, 'RECORDS', {
            fontSize: '40px',
            fill: '#ffffff'
        }).setInteractive();
        this.texto.on('pointerdown', () => {
            alert("Coming soon in the new season :3");
        });

    }
}

class SceneSelector extends Phaser.Scene {

    constructor() {
        super({ key: 'SceneSelector' });
    }

    preload() {
        this.load.setPath("./assets");
        this.load.image("menu", "../assets/menu.jpg");
        this.load.image("pcmn", "../assets/pcmn.png");
    }
    create() {
        this.add.image(400, 300, "menu");
        this.add.image(1050, 300, "pcmn");
        this.texto = this.add.text(200, 100, 'PACMAN', {
            fontSize: '80px',
            fill: '#ffffff'
        });
        this.texto = this.add.text(200, 400, 'Arcade (Personaje Amarillo)', {
            fontSize: '40px',
            fill: '#ffffff'
        }).setInteractive();
        this.texto.on('pointerdown', () => {
            this.scene.start('SceneArcade');
        });
        this.texto = this.add.text(200, 475, 'Clásico (Personaje Rojo)', {
            fontSize: '40px',
            fill: '#ffffff'
        }).setInteractive();
        this.texto.on('pointerdown', () => {
            this.scene.start('SceneClasico');
        });

    }
}

class SceneGameOver extends Phaser.Scene {

    constructor() {
        super({ key: 'SceneGameOver' });
    }

    preload() {
        this.load.setPath("./assets");
        this.load.image("menu", "../assets/menu.jpg");
        this.load.image("pcmn", "../assets/pcmn.png");
    }
    create() {
        this.add.image(400, 300, "menu");
        this.add.image(1050, 300, "pcmn");
        this.texto = this.add.text(200, 100, '¡HAS PERDIDO!', {
            fontSize: '80px',
            fill: '#ffffff'
        });
        this.texto = this.add.text(200, 400, 'Volver al menú', {
            fontSize: '40px',
            fill: '#ffffff'
        }).setInteractive();
        this.texto.on('pointerdown', () => {
            this.scene.start('SceneMenu');
        });

    }
}

const config = {
    title: "menu",
    version: "0.0.1",
    type: Phaser.AUTO,
    scale: {
        parent: "phaser_container",
        width: 1350,
        height: 600,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    backgroundColor: "#f9ca24",
    pixelArt: true,
    physics: {
        default: "arcade",
        "arcade": {
            gravity: {
                y: 300
            }
        }
    },
    scene: [
        SceneMenu, SceneSelector, SceneArcade, SceneClasico, SceneGameOver
    ]
};

new Phaser.Game(config);
