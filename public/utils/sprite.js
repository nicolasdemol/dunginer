export class Sprite {
  constructor(image, columns, tileWidth = 16, tileHeight = 16) {
    this.image = image;
    this.columns = columns || 0;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
  }

  draw(ctx, tileIndex, dx, dy, scale = 1) {
    const tileX = Math.floor((tileIndex % this.columns) * this.tileWidth);
    const tileY = Math.floor(
      Math.floor(tileIndex / this.columns) * this.tileHeight
    );
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
      this.image,
      tileX,
      tileY,
      this.tileWidth,
      this.tileHeight,
      Math.floor(dx),
      Math.floor(dy),
      Math.floor(this.tileWidth * scale),
      Math.floor(this.tileHeight * scale)
    );
  }
}
