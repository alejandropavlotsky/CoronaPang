class Background {

    constructor(ctx, url, width, height,) {

        this.ctx = ctx
        this.url = url
        this.sizes = {
            w: width,
            h: height
        }
        
        // start position
        this.posX = 0
        this.posY = 0

        this.image = new Image()
        this.image.src = `img/${this.url}`
        this.image.onload = () => {
            this.draw()
        }
        
    }
    
    
    draw() {
        this.ctx.drawImage(this.image, this.posX, this.posY, this.sizes.w, this.sizes.h)
    }
}