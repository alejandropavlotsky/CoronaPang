const game = {
	name: 'CoronaPang',
	description: 'Super Pang game with Coronavirus theme',
	version: '1.0.0',
	license: undefined,
	author: 'Alejandro Murawczik',

	interval: 0,
	canvasDom: undefined,
	ctx: undefined,
	fps: 60,
	// timeLimit: 0,
	canvasSize: {
		w: undefined,
		h: undefined
	},

	keys: {
		LEFT: 37,
		RIGHT: 39,
		SPACE: 32
	},
	score: 0,
	player: undefined,
	frames: 0,
	bullets: [],
	coronavirus: [],
	lifes: [],
	powerups: [],
	powerdown: [],
	speedup: [],
	shootmore: [],
	backgroundAudio: new Audio('./sound/AlchemistsTale.mp3'),
	extraLifeAudio: new Audio('./sound/woohoo.mp3'),
	lifeTakenAudio: new Audio('./sound/doh.mp3'),
	powerDownAudio: new Audio('./sound/haha.mp3'),
	winSound: new Audio('./sound/yeah.mp3'),
	loseSound: new Audio('./sound/booing.mp3'),

	init(id) {
		this.canvasDom = document.getElementById(id);
		this.ctx = this.canvasDom.getContext('2d');
		this.setDimensions();
		this.setListeners();
		this.start();
	},

	setDimensions() {
		this.canvasSize.w = window.innerWidth;
		this.canvasSize.h = window.innerHeight;
		this.canvasDom.setAttribute('width', this.canvasSize.w);
		this.canvasDom.setAttribute('height', this.canvasSize.h);
	},

	clearScreen() {
		this.ctx.clearRect(0, 0, this.canvasSize.w, this.canvasSize.h);
	},

	setListeners() {
		document.addEventListener('keydown', (e) => {
			e.preventDefault();
			if (e.keyCode === this.keys.LEFT) {
				this.player.keyState.keyLeft = true;
			}
			if (e.keyCode === this.keys.RIGHT) {
				this.player.keyState.keyRight = true;
			}
			if (e.keyCode === this.keys.SPACE) {
				this.newBullet();
			}
		});

		document.addEventListener('keyup', (e) => {
			e.preventDefault();
			if (e.keyCode === this.keys.LEFT) {
				this.player.keyState.keyLeft = false;
			}
			if (e.keyCode === this.keys.RIGHT) {
				this.player.keyState.keyRight = false;
			}
		});
	},

	moveAll() {
		this.coronavirus.forEach((corona) => corona.move());
		this.player.move();
	},

	drawAll() {
		this.background.draw();
		this.player.draw();
		this.lifes.forEach((life) => life.draw());
		this.bullets.forEach((bullet) => bullet.draw());
		this.coronavirus.forEach((corona) => corona.draw());
		this.powerups.forEach((power) => power.draw());
		this.powerdown.forEach((power) => power.draw());
		this.speedup.forEach((power) => power.draw());
	},

	start() {
		this.reset();
		this.backgroundAudio.play();
		this.interval = setInterval(() => {
			this.frames > 5000 ? (this.frames = 0) : null;
			this.frames++;
			this.clearScreen();
			this.drawAll();
			this.moveAll();
			this.drawScore();
			this.powerUpsAppear();
			this.shootMore();
			this.extraLife();
			this.slowDown();
			this.speedUpPower();
			this.hitCoronavirus();
			this.changeDirectionAfterCollision();

			// set game over si no hay mas vidas
			if (this.lifes.length === 0) {
				this.gameOver();
			}
			// set you win si no hay mas coronavirus
			if (this.coronavirus.length === 0) {
				this.youWon();
			}
			this.clearBullets();
		}, 1000 / this.fps);
	},

	powerUpsAppear() {
		// Vida Extra
		this.frames % 1500 === 0 &&
			this.powerups.push(
				new powerUp(
					this.ctx,
					'powerup.png',
					50,
					50,
					Math.floor(Math.random() * (this.canvasSize.w - 100)),
					0,
					1
				)
			);

		// Double shot
		this.frames % 800 === 0 &&
			this.shootmore.push(
				new shootMore(
					this.ctx,
					'doubleshoot.png',
					50,
					50,
					Math.floor(Math.random() * (this.canvasSize.w - 100)),
					0,
					1
				)
			);

		// Slow Down
		this.frames % 400 === 0 &&
			this.powerdown.push(
				new powerDown(
					this.ctx,
					'snail.png',
					50,
					50,
					Math.floor(Math.random() * (this.canvasSize.w - 100)),
					0,
					1
				)
			);

		// Speed up
		this.frames % 600 === 0 &&
			this.speedup.push(
				new speedUp(
					this.ctx,
					'speedup.png',
					50,
					50,
					Math.floor(Math.random() * (this.canvasSize.w - 100)),
					0,
					1
				)
			);
	},

	slowDown() {
		// slow down tras colisionar con player
		this.powerdown.forEach((power, idx) => {
			power.draw();
			power.move();

			if (this.isCollision(this.player, power)) {
				this.powerdown.splice(idx, 1);
				this.player.velX -= 4;
				this.powerDownAudio.play();
				this.lessScorePoints(50);
			}
		});
	},

	speedUpPower() {
		// speed up tras colisionar con player
		this.speedup.forEach((power, idx) => {
			power.draw();
			power.move();

			if (this.isCollision(this.player, power)) {
				this.speedup.splice(idx, 1);
				this.extraLifeAudio.play();
				this.player.velX += 3;
				this.scorePoints(50);
			}
		});
	},

	extraLife() {
		// vida extra tras colisionar player con vida extra
		this.powerups.forEach((power, idx) => {
			power.draw();
			power.move();

			if (this.isCollision(this.player, power)) {
				this.powerups.splice(idx, 1);
				this.lifes.push(new Life(this.ctx, 'Heart.png', 50, 50, 1100 + this.lifes.length * 50, 20));
				this.extraLifeAudio.play();
				this.scorePoints(50);
			}
		});
	},

	shootMore() {
		// double shoot tras colisionar con shootmore
		this.shootmore.forEach((shoot, idx) => {
			shoot.draw();
			shoot.move();
			if (this.isCollision(this.player, shoot)) {
				this.shootmore.splice(idx, 1);
				this.scorePoints(50);
				this.player.canShoot = true;
				this.extraLifeAudio.play();
				setTimeout(() => {
					this.player.canShoot = false;
				}, 5000);
			}
		});
	},

	changeDirectionAfterCollision() {
		// cambia de direccion tras colisionar con player y quita una vida
		this.coronavirus.forEach((corona) => {
			if (this.isCollision(corona, this.player)) {
				corona.velX *= -1;
				corona.velY *= -1;
				this.lifes.pop();
				this.lifeTakenAudio.play();
				this.lessScorePoints(150);
			}
		});
	},

	newBullet() {
		// create an instance of bullet after pressing SPACE bar
		if (this.bullets.length < 1 || this.player.canShoot) {
			this.bullets.push(new Bullet(this.ctx, 'waterdrop.png', 10, 100, this.player.posX, this.player.posY));
		}
	},

	clearBullets() {
		// clear the bullets after they are off screen
		this.bullets = this.bullets.filter((elm) => elm.posY + elm.sizes.h > 0);
	},

	reset() {
		this.background = new Background(this.ctx, 'bg-g.png', this.canvasSize.w, this.canvasSize.h);

		this.player = new Player(this.ctx, 'Juanito.png', this.canvasSize.w, this.canvasSize.h, this.keys);
		this.coronavirus.push(
			new Coronavirus(
				this.ctx,
				'coronito.gif',
				200,
				200,
				3,
				0.1,
				10,
				10,
				undefined,
				this.canvasSize.w,
				this.canvasSize.h,
				0.1,
				200
			)
		);
		this.lifes.push(new Life(this.ctx, 'Heart.png', 50, 50, 1100, 20));
		this.lifes.push(new Life(this.ctx, 'Heart.png', 50, 50, 1150, 20));
		this.lifes.push(new Life(this.ctx, 'Heart.png', 50, 50, 1200, 20));
	},

	isCollision(obj1, obj2) {
		return (
			obj1.posX < obj2.posX + obj2.sizes.w &&
			obj1.posX + obj1.sizes.w > obj2.posX &&
			obj1.posY < obj2.posY + obj2.sizes.h &&
			obj1.posY + obj1.sizes.h > obj2.posY
		);
	},

	isRoundCollision(obj1, obj2) {
		// vertical and horizontal distance between the circle center and the rectangle center
		let distX = Math.abs(obj2.posX - obj1.posX - obj1.sizes.w / 2);
		let distY = Math.abs(obj2.posY - obj1.posY - obj1.sizes.h / 2);
		
		// if the distance is greater than half Circle + half rect they are too far apart to be colliding
		if (distX > (obj1.sizes.w / 2 + obj2.radius)) { return false; }
		if (distY > (obj1.sizes.h / 2 + obj2.radius)) { return false; }

		//if the distance is less than half rect they collide
		if (distX <= (obj1.sizes.w / 2)) { return true; }
		if (distY <= (obj1.sizes.h / 2)) { return true; }

		// test for collision at rect corner
		let dx = distX - obj1.sizes.w / 2;
		let dy = distY - obj1.sizes.h / 2;
		return (dx * dx + dy * dy <= (obj2.radius * obj2.radius));
	},

	hitCoronavirus() {
		// hit coronavirus method
		this.coronavirus.forEach((corona, idx) => {
			this.bullets.forEach((bullet, index) => {
				if (this.isRoundCollision(bullet, corona)) {
					this.killBullet(index);
					this.divideCoronavirus(corona, idx);
					this.scorePoints(100);
				}
			});
		});
	},

	divideCoronavirus(corona, idx) {
		let deletedCoronavirus = this.coronavirus.splice(idx, 1)[0];
		let nextDivision = ++deletedCoronavirus.actualDivision;

		if (nextDivision < deletedCoronavirus.maxDivision) {
			this.coronavirus.push(
				new Coronavirus(
					this.ctx,
					'coronito.gif',
					deletedCoronavirus.sizes.w / 1.7,
					deletedCoronavirus.sizes.h / 1.7,
					(deletedCoronavirus.velX *= 1.05),
					(deletedCoronavirus.velY *= 1.05),
					deletedCoronavirus.posX + 50,
					deletedCoronavirus.posY - deletedCoronavirus.posY + 150,
					nextDivision,
					deletedCoronavirus.canvasW,
					deletedCoronavirus.canvasH,
					(deletedCoronavirus.gravity += 0.0111),
					deletedCoronavirus.radius /1.7
				)
			);
			this.coronavirus.push(
				new Coronavirus(
					this.ctx,
					'coronito.gif',
					deletedCoronavirus.sizes.w / 1.7,
					deletedCoronavirus.sizes.h / 1.7,
					(deletedCoronavirus.velX *= -1.05),
					(deletedCoronavirus.velY *= 1.05),
					deletedCoronavirus.posX - 50,
					deletedCoronavirus.posY - deletedCoronavirus.posY + 150,
					nextDivision,
					deletedCoronavirus.canvasW,
					deletedCoronavirus.canvasH,
					(deletedCoronavirus.gravity += 0.0111),
					deletedCoronavirus.radius /1.7
				)
			);
		}
	},

	killBullet(idx) {
		this.bullets.splice(idx, 1);
	},

	gameOver() {
		this.backgroundAudio.pause();
		this.loseSound.play();
		clearInterval(this.interval);
		// window.clearInterval(this.interval);
		document.getElementById('canvas').style.display = 'none';
		document.getElementById('lose-score').style.display = 'block';
		document.getElementById('lose-points').innerHTML = `${this.score} `;
		document.getElementById('lose-start-button').onclick = () => {
			document.location.reload();
		};
	},

	youWon() {
		this.backgroundAudio.pause();
		this.winSound.play();
		clearInterval(this.interval);
		document.getElementById('canvas').style.display = 'none';
		document.getElementById('win-score').style.display = 'block';
		document.getElementById('win-points').innerHTML = `${this.score} `;
		document.getElementById('win-start-button').onclick = () => {
			document.location.reload();
		};
	},

	drawScore() {
		this.ctx.fillStyle = 'white';
		this.ctx.font = '20px sans-serif';
		this.ctx.fillText(`Points: ${this.score}`, 40, 40);
	},

	scorePoints(morePoints) {
		this.score += morePoints;
	},

	lessScorePoints(lessPoints) {
		this.score -= lessPoints;
	}
};
