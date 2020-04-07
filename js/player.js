class Player {
	constructor(ctx, url, width, height, keys) {
		this.ctx = ctx;
		this.url = url;
		this.canvasSizes = {
			w: width,
			h: height
        };
        // player size
		this.sizes = {
			w: 100,
			h: 100
		};
		this.keys = keys;
		// start position
		this.posX = this.canvasSizes.w / 2 - this.sizes.w / 2;
		this.posY = this.canvasSizes.h - this.sizes.h * 1.5;
		this.velX = 40;
        // load image
		this.playerImage = new Image();
		this.playerImage.src = `img/${this.url}`;
		this.playerImage.onload = () => {
			this.draw();
		};
	}

	draw() {
		this.ctx.drawImage(this.playerImage, this.posX, this.posY, this.sizes.w, this.sizes.h);
	}

	move(dir) {
		dir === 'right' ? (!this.rigthCollide() ? (this.posX += this.velX) : null) : null;
		dir === 'left' ? (!this.leftCollide() ? (this.posX -= this.velX) : null) : null;

		this.draw();
	}

	leftCollide() {
		return this.posX <= this.sizes.w / 3 ? true : false;
	}

	rigthCollide() {
		return this.posX >= this.canvasSizes.w - this.sizes.w * 1.3 ? true : false;
	}
}
