class Coronavirus {
	constructor(ctx, url, width, height, velX, velY, posX, posY, actualDivision = 0, canvasW, canvasH, gravity) {
		this.ctx = ctx;
		this.url = url;
		this.sizes = {
			w: width,
			h: height
		};
		this.canvasW = canvasW
		this.canvasH = canvasH

		// start position
		this.posX = posX;	//1
		this.posY = posY;	//0

		// start velocity
		this.velX = velX; 	//3
		this.velY = velY; 	//0.1

		// gravity
		this.gravity = gravity //0.1;

		// loading image
		this.image = new Image();
		this.image.src = `img/${this.url}`;
		this.image.onload = () => {
			this.draw();
		};

		// coronavirus division
		this.maxDivision = 4
		this.actualDivision = actualDivision
	}

	draw() {
		// draw image and add movement
		this.ctx.drawImage(this.image, this.posX, this.posY, this.sizes.w, this.sizes.h);
	}

	move() {
		// add movement
		this.posX += this.velX;
		// adds gravity
		this.velY += this.gravity;
		this.posY += this.velY;
		// Collide with canvas		
		this.posY > this.canvasH - this.sizes.h ? (this.velY *= -1) : null;
		this.posX > this.canvasW - this.sizes.w ? (this.velX *= -1) : null;
		this.posX < 0 ? (this.velX *= -1) : null;
		this.posY < 0 ? (this.velY *= -1) : null;

	}


}
