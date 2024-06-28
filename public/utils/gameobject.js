export class GameObject {
  constructor(x, y, width, height, sprite) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.sprite = sprite;
    this.frame = 0;
  }

  draw(ctx) {
    this.sprite.drawTile(ctx, this.frame, this.x, this.y);
  }

  update() {
    // Méthode de mise à jour générique, à surcharger dans les sous-classes si nécessaire
  }
}
