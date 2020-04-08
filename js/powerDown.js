class powerDown {
	constructor(ctx, url, width, height, posX, posY, speed) {
		this.ctx = ctx;
		this.url = url;
		this.sizes = {
			w: width,
			h: height
		};
		this.posX = posX;
		this.posY = posY;
		this.speed = speed;

		this.image = new Image();
		this.image.src = `img/${this.url}`;
		this.image.onload = () => {
			this.draw();
		};
	}
	draw() {
		this.ctx.drawImage(this.image, this.posX, this.posY, this.sizes.w, this.sizes.h);
		this.move();
	}
	move() {
		this.posY += this.speed;
	}
}
