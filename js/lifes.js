class Life {
    constructor(ctx, url, width, height, posX, posY) {
        this.ctx = ctx;
		this.url = url;
		this.sizes = {
			w: width,
			h: height
		};
		// position
		this.posX = posX;	//1
		this.posY = posY;	//0

		this.image = new Image();
		this.image.src = `img/${this.url}`;
		this.image.onload = () => {
			this.draw();
		};

	}
	draw() {
		// draw image and add movement
		this.ctx.drawImage(this.image, this.posX, this.posY, this.sizes.w, this.sizes.h);
	}
}