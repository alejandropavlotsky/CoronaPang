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
	canvasSize: {
		w: undefined,
		h: undefined
	},

	keys: {
		LEFT: 37,
		RIGHT: 39,
		SPACE: 32
	},
	player: undefined,
	frames: 0,
	bullets: [],
	coronavirus: [],
	lifes: [],
	powerups: [],

	init(id) {
		this.canvasDom = document.getElementById(id);
		this.ctx = this.canvasDom.getContext('2d');
		this.setDimensions();
		this.setEventListeners();
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

	setEventListeners() {
		document.onkeyup = (e) => {
			e.keyCode === this.keys.SPACE ? this.newBullet() : null;
			e.keyCode === this.keys.LEFT ? this.player.move('left') : null;
			e.keyCode === this.keys.RIGHT ? this.player.move('right') : null;
		};
	},

	moveAll() {
		this.coronavirus.forEach((corona) => corona.move())	
	},
	drawAll() {
		this.background.draw();
		this.player.draw();
		this.lifes.forEach((life) => life.draw());
		this.bullets.forEach((bullet) => bullet.draw());
		this.coronavirus.forEach((corona) => corona.draw());
		this.powerups.forEach((power) => power.draw());
	},

	start() {
		this.reset();
		this.interval = setInterval(() => {
			this.frames > 5000 ? (this.frames = 0) : null;
			this.frames++;

			this.clearScreen();

			this.drawAll();
			this.moveAll()

			this.frames % 250 === 0 &&
				this.powerups.push(
					new powerUp(
						this.ctx,
						'powerup.png',
						50,
						50,
						Math.floor(Math.random() * (this.canvasSize.w - 50)),
						0,
						1
					)
				);
				console.log(this.lifes);
			this.powerups.forEach(
				(power, idx) => {
					power.draw();
					power.move();
					
					if (this.isCollision(this.player, power)) { 
						this.powerups.pop()
						this.lifes.push(new Life(this.ctx, 'Heart.png', 50, 50, 1100 + (this.lifes.length *50), 20))
					}
						
					

				},
				this.coronavirus.forEach((corona, idx) => {
					this.bullets.forEach((bullet, index) => {
						if (this.isCollision(bullet, corona)) {
							this.killBullet(index);
							this.divideCoronavirus(corona, idx);
						}
					});
				}),
				this.coronavirus.forEach((corona) => {
					if (this.isCollision(this.player, corona)) {
						this.lifes.pop();
					}
				})
			),
				this.clearBullets();
			// this.isCollision(this.coronavirus, this.player) ? this.gameOver() : null;
		}, 1000 / this.fps);
	},

	newBullet() {
		// create an instance of bullet after pressing SPACE bar
		this.bullets.push(new Bullet(this.ctx, 'waterdrop.png', 10, 100, this.player.posX, this.player.posY));
	},

	clearBullets() {
		// clear the bullets after they are off screen
		this.bullets = this.bullets.filter((elm) => elm.posY > 0);
	},

	reset() {
		this.background = new Background(this.ctx, 'bg-g.png', this.canvasSize.w, this.canvasSize.h)
		
			this.player = new Player(this.ctx, 'Juanito.png', this.canvasSize.w, this.canvasSize.h, this.keys);
			console.log(this.canvasSize.h);
			
			this.coronavirus.push(new Coronavirus(this.ctx, 'coronito.gif', 100, 100, 3, 0.1, 10, 10, undefined, this.canvasSize.w, this.canvasSize.h));
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

	divideCoronavirus(corona, idx) {
		let deletedCoronavirus = this.coronavirus.splice(idx, 1)[0];
		let nextDivision = ++deletedCoronavirus.actualDivision;

		if (nextDivision < deletedCoronavirus.maxDivision) {
			console.log(this.coronavirus);

			this.coronavirus.push(
				new Coronavirus(
					this.ctx,
					'coronito.gif',
					deletedCoronavirus.sizes.w / 2,
					deletedCoronavirus.sizes.h / 2,
					(deletedCoronavirus.velX *= 1),
					deletedCoronavirus.velY,
					deletedCoronavirus.posX + 50,
					deletedCoronavirus.posY,
					nextDivision,
					deletedCoronavirus.canvasW,
					deletedCoronavirus.canvasH

				)
			);
			this.coronavirus.push(
				new Coronavirus(
					this.ctx,
					'coronito.gif',
					deletedCoronavirus.sizes.w / 2,
					deletedCoronavirus.sizes.h / 2,
					(deletedCoronavirus.velX *= -1),
					deletedCoronavirus.velY,
					deletedCoronavirus.posX - 50,
					deletedCoronavirus.posY,
					nextDivision,
					deletedCoronavirus.canvasW,
					deletedCoronavirus.canvasH
				)
			);
		}
	},

	killBullet(idx) {
		this.bullets.splice(idx, 1);
	},

	gameOver() {
		clearInterval(this.interval);
		this.ctx.font = 'bold 22px sans-serif';
		this.ctx.fillText('Play again', window.innerWidth / 2, window.innerHeight / 2);
	}
};
