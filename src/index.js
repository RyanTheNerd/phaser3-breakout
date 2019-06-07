import Phaser from "phaser";
import start from "./assets/start.png";

const COLOR = 0xff6600;

let startScene = new Phaser.Scene('start');

startScene.preload = function() {
    this.load.image('start', start);
    this.scene.add('main', mainScene, false);
}
startScene.create = function() {
    this.add.image(400, 300, 'start');
    this.space = this.input.keyboard.addKey("SPACE");
}
startScene.update = function() {
    if(this.space.isDown) {
        this.scene.start('main');
    }
}

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    resolution: window.devicePixelRatio,
    scene: startScene,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            fps: 60,
        }
    }
};

let mainScene = new Phaser.Scene('main');

mainScene.preload = function()
{
    let paddleWidth = 75;
    let paddleHeight = 10;
    let paddleImg = this.add.graphics();
    paddleImg.fillStyle(COLOR, 1.0);
    paddleImg.fillRect(0, 0, paddleWidth, paddleHeight);
    paddleImg.generateTexture('paddle', paddleWidth, paddleHeight);
    paddleImg.visible = false;

    let brickImg = this.add.graphics();
    brickImg.fillStyle(COLOR, 1.0);
    brickImg.fillRect(0, 0, 80, 30);
    brickImg.generateTexture('brick', 80, 30);
    brickImg.visible = false;

    let ballRadius = 10;
    this.ballRadius = ballRadius;
    let ballImg = this.add.graphics();
    ballImg.fillStyle(COLOR, 1.0);
    ballImg.fillCircle(ballRadius, ballRadius, ballRadius);
    ballImg.generateTexture('ball', ballRadius*2, ballRadius*2);
    ballImg.visible = false;

    this.keys = this.input.keyboard.addKeys('A, D, LEFT, RIGHT, H, L, SPACE');
    this.leftIsDown = function() {
        if(this.keys.A.isDown || this.keys.LEFT.isDown || this.keys.H.isDown) {
            return true;
        }
        return false;
    }
    this.rightIsDown = function() {
        if(this.keys.D.isDown || this.keys.RIGHT.isDown || this.keys.L.isDown) {
            return true;
        }
        return false;
    }
    
}

mainScene.create = function()
{
    this.physics.world.setBounds(0, 0, 800, 600);
    this.physics.world.setBoundsCollision(true, true, true, false);

    this.paddle = this.physics.add.sprite(400, 580, 'paddle');
    this.paddle.speed = 750;
    this.paddle.body.immovable = true;
    this.paddle.body.collideWorldBounds = true;

    this.ball = this.physics.add.sprite(this.paddle.x, this.paddle.y - this.ballRadius - this.paddle.height/2, 'ball');
    this.ball.body.collideWorldBounds = true;
    this.ball.body.bounce.setTo(1);
    this.ballSpeed = 600;
    this.ball.onPaddle = true;


    this.physics.add.collider(this.paddle, this.ball, function(paddle, ball) {
        if(ball.onPaddle) {
            return;
        }
        let newAngle = ((this.ball.x - this.paddle.x) / this.paddle.width)*2;        
        if (Math.abs(newAngle) > 0.5) {
            this.physics.velocityFromAngle(
                newAngle*45 - 90,
                this.ballSpeed,
                this.ball.body.velocity,
            );
        }
    }, null, this);

    this.bricks = this.physics.add.group({'immovable': true});
    for(let i = 0; i < 8; i++) {
        for(let j = 0; j < 4; j++) {
            let brick = this.add.sprite((i*100) + 50, (j*50) + 25, 'brick');
            this.bricks.add(brick);
        }
    }

    this.score = 0;
    this.physics.add.collider(this.ball, this.bricks, function(ball, brick) {
        this.ballSpeed++;
        brick.destroy();
        this.score++;
        if(this.bricks.countActive() == 0) {
            this.add.text(400, 300, 'Woah, you won.', {fontFamily: 'Roboto Mono'});
            this.ball.destroy();
        }
    }, null, this);


}

mainScene.update = function() {
    this.paddle.setVelocity(0, 0);

    if(this.keys.SPACE.isDown && this.ball.body.enable) {
        this.ball.onPaddle = false;
        this.physics.velocityFromAngle(
            90 + Phaser.Math.Between(-45, 45), 
            this.ballSpeed, 
            this.ball.body.velocity,
        );
    }
    else if (this.keys.SPACE.isDown && this.ball.body.enable == false) {
        this.scene.start('main');
    }

    if (this.leftIsDown()) {
        this.paddle.setVelocityX(-this.paddle.speed);
    }
    else if (this.rightIsDown()) {
        this.paddle.setVelocityX(this.paddle.speed);
    }

    if(this.ball.onPaddle) {
        this.ball.x = this.paddle.x;
        this.ball.y = this.paddle.y - this.ball.height/2 - this.paddle.height/2;
    }

    if (this.ball.y >= 600) {
        this.ball.disableBody();
        this.add.text(400, 300, 'Oops, you lost.', {fontFamily: 'Roboto Mono'});
    }
}
var game = new Phaser.Game(config);
