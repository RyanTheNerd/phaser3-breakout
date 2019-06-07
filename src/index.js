import Phaser from "phaser";

const COLOR = 0xff6600;

let mainScene = new Phaser.Scene('main');

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    resolution: window.devicePixelRatio,
    scene: mainScene,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        }
    }
};

mainScene.preload = function()
{
    let paddleImg = this.add.graphics();
    paddleImg.fillStyle(COLOR, 1.0);
    paddleImg.fillRect(0, 0, 150, 20);
    paddleImg.generateTexture('paddle', 150, 20);
    paddleImg.visible = false;

    let brickImg = this.add.graphics();
    brickImg.fillStyle(COLOR, 1.0);
    brickImg.fillRect(0, 0, 80, 30);
    brickImg.generateTexture('brick', 80, 30);
    brickImg.visible = false;

    let ballRadius = 10;
    let ballImg = this.add.graphics();
    ballImg.fillStyle(COLOR, 1.0);
    ballImg.fillCircle(ballRadius, ballRadius, ballRadius);
    ballImg.generateTexture('ball', ballRadius*2, ballRadius*2);
    ballImg.visible = false;

    this.cursors = this.input.keyboard.createCursorKeys();
}

mainScene.create = function()
{
    this.physics.world.setBounds(0, 0, 800, 600);
    this.physics.world.setBoundsCollision(true, true, true, false);

    this.paddle = this.physics.add.sprite(400, 580, 'paddle');
    this.paddle.speed = 500;
    this.paddle.body.immovable = true;
    this.paddle.body.collideWorldBounds = true;

    this.ball = this.physics.add.sprite(400, 300, 'ball');
    this.ball.body.collideWorldBounds = true;
    this.ball.body.bounce.setTo(1);
    this.ballSpeed = 400;

    this.physics.velocityFromAngle(
        (Math.random() > 0.5 ? 90 : -90) + Phaser.Math.Between(-45, 45), 
        this.ballSpeed, 
        this.ball.body.velocity,
    );

    this.physics.add.collider(this.paddle, this.ball, function(paddle, ball) {
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
    if (this.cursors.left.isDown) {
        this.paddle.setVelocityX(-this.paddle.speed);
    }
    else if (this.cursors.right.isDown) {
        this.paddle.setVelocityX(this.paddle.speed);
    }

    if (this.ball.y >= 600) {
        this.ball.destroy();
        this.add.text(400, 300, 'Oops, you lost.', {fontFamily: 'Roboto Mono'});
    }
}
var game = new Phaser.Game(config);
