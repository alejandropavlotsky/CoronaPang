class Bullet {
	constructor(ctx, url, width, height, playerposX, playerposY) {
		this.ctx = ctx;
		this.url = url;
		this.sizes = {
			w: width,
			h: height
		};
		

		// start position
		this.posX = playerposX * 1.07;
		this.posY = playerposY / 1.15;
		// start velocity
		this.velY = 10;
		// load image
		this.image = new Image();
		this.image.src = `img/${this.url}`;
        this.image.onload = () => {
            this.draw();
        }
	}

	draw() {
		// draw image and add movement
		this.ctx.drawImage(this.image, this.posX +33, this.posY, this.sizes.w, this.sizes.h);
		this.move();
	}

    move() {
		this.posY -= this.velY;
	}
}
