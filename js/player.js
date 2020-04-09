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
		// start position
		this.posX = this.canvasSizes.w / 2 - this.sizes.w / 2;
		this.posY = this.canvasSizes.h - this.sizes.h * 1.5;
		this.velX = 10;
        // load image
		this.playerImage = new Image();
		this.playerImage.src = `img/${this.url}`;
		this.playerImage.onload = () => {
			this.draw();
		};
		
		this.keys = keys;
		
        this.keyState = {
			keyLeft: false,
            keyRight: false
		}
		this.canShoot = false
	}



	draw() {
		this.ctx.drawImage(this.playerImage, this.posX, this.posY, this.sizes.w, this.sizes.h);
	}


	leftCollide() {
		return this.posX <= this.sizes.w / 3 ? true : false;
	}

	rigthCollide() {
		return this.posX >= this.canvasSizes.w - this.sizes.w * 1.3 ? true : false;
	}

	move(){
		if (this.keyState.keyLeft && !this.leftCollide()) {
			this.posX -= this.velX
		}
		if (this.keyState.keyRight && !this.rigthCollide()) {
			this.posX += this.velX
		}
	}
}
