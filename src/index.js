import Phaser from "phaser";
import ballImg from './assets/ball.png';
import paddleImg from './assets/paddle.png';
import brickImg from './assets/brick.png';

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
    this.load.image('ball', ballImg);
    this.load.image('brick', brickImg);
    this.load.image('paddle', paddleImg); 
    this.cursors = this.input.keyboard.createCursorKeys();
}

mainScene.create = function()
{
    this.physics.world.setBounds(0, 0, 800, 600);
    this.physics.world.setBoundsCollision(true, true, true, false);

    this.paddle = this.physics.add.sprite(400, 580, 'paddle');
    this.paddle.speed = 300;
    this.paddle.body.immovable = true;
    this.paddle.body.collideWorldBounds = true;

    this.ball = this.physics.add.sprite(400, 300, 'ball');
    this.ball.body.collideWorldBounds = true;
    this.ball.body.bounce.setTo(1);
    this.ballSpeed = 300;

    this.physics.velocityFromAngle(
        (Math.random() > 0.5 ? 90 : -90) + Phaser.Math.Between(-45, 45), 
        this.ballSpeed, 
        this.ball.body.velocity,
    );

    this.physics.add.collider(this.paddle, this.ball);

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
