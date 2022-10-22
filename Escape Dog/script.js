import Player from "./player.js";
import InputHandler from "./input.js";
import { Background } from "./background.js";
import { FlyingEnemy, ClimbingEnemy, GroundEnemy } from "./enemies.js";
import { UI } from "./UI.js";
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 500;
class Game {
	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.groundMargin = 80;
		this.speed = 0;
		this.maxSpeed = 6;
		this.background = new Background(this);
		this.player = new Player(this);
		this.input = new InputHandler(this);
		this.UI = new UI(this);
		this.enemies = [];
		this.maxParticles = 50;
		this.enemyTimer = 0;
		this.enemyInterval = 1000;
		this.debug = false;
		this.score = 0;
		this.fontColor = "black";
		this.player.currentState = this.player.states[0];
		this.player.currentState.enter();
		this.particles = [];
		this.collisions = [];
		this.time = 0;
		this.maxTime = 50000;
		this.winningScore = 70;
		this.gameOver = false;
		this.lives = 5;
		this.floatingMessages = [];
	}
	update(deltaTime) {
		this.time += deltaTime;
		if (this.time > this.maxTime) {
			this.gameOver = true;
		}
		this.background.update();
		this.player.update(this.input, deltaTime);

		// Handle enemies
		if (this.enemyTimer > this.enemyInterval) {
			this.addEnemy();
			this.enemyTimer = 0;
		} else {
			this.enemyTimer +=
				(deltaTime * (this.player.speed + this.player.maxSpeed)) / 6;
		}
		this.enemies.forEach((enemy) => {
			enemy.update(deltaTime);
		});
		this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);

		// Handle messages
		this.floatingMessages.forEach((message) => {
			message.update();
		});
		this.floatingMessages = this.floatingMessages.filter(
			(message) => !message.markedForDeletion
		);

		// Handle particles
		this.particles.forEach((particle, i) => {
			particle.update();
		});
		this.particles = this.particles.filter(
			(particle) => !particle.markedForDeletion
		);
		if (this.particles.length > this.maxParticles) {
			this.particles.length = this.maxParticles;
		}

		// Handle collision sprites
		this.collisions.forEach((collision, i) => {
			collision.update(deltaTime);
		});
		this.collisions = this.collisions.filter(
			(collision) => !collision.markedForDeletion
		);
	}
	draw(context) {
		this.background.draw(context);
		this.player.draw(context);
		this.enemies.forEach((enemy) => {
			enemy.draw(context);
		});
		this.UI.draw(context);
		this.particles.forEach((particle) => {
			particle.draw(context);
		});
		this.collisions.forEach((collision, i) => {
			collision.draw(context);
		});
		// Handle messages
		this.floatingMessages.forEach((fM) => {
			fM.draw(context);
		});
	}
	addEnemy() {
		if (this.speed > 0 && Math.random() < 0.5) {
			this.enemies.push(new GroundEnemy(this));
		} else if (this.speed > 0) {
			this.enemies.push(new ClimbingEnemy(this));
		}
		this.enemies.push(new FlyingEnemy(this));
	}
}

const game = new Game(canvas.width, canvas.height);


window.addEventListener("load", function () {


	let lastTime = 0;

	function animate(timeStamp) {
		const deltaTime = timeStamp - lastTime;
		lastTime = timeStamp;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		game.update(deltaTime);
		game.draw(ctx);
		if (!game.gameOver) {
			requestAnimationFrame(animate);
		}
	}
	animate(0);
});
