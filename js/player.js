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
		this.velX = 40;
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

// move() {
//         if (this.keyState.keyLeft && this.posX > this.leftLimit) {
//             this.posX -= this.velX
//         }
//         if (this.keyState.keyRight && this.posX + this.width < this.rigthLimit) {
//             this.posX += this.velX
//         }
//         if(this.posY <= this.posY0 && this.isFloating === false) {
//             this.posY += this.velY;
//             this.velY += this.gravity;
//           } else if(this.isFloating === false) {
//             this.velY = 1;
//             this.posY = this.posY0;
//           }
//     }