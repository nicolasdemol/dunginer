export class Camera {
  constructor(x, y, width, height, mapWidth, mapHeight, zoom = 2) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;
    this.zoom = zoom;
  }

  follow(player) {
    this.x = Math.round(player.x - this.width / 2 / this.zoom);
    this.y = Math.round(player.y - this.height / 2 / this.zoom);

    this.x = Math.max(
      0,
      Math.min(this.x, this.mapWidth - this.width / this.zoom)
    );
    this.y = Math.max(
      0,
      Math.min(this.y, this.mapHeight - this.height / this.zoom)
    );
  }

  render(ctx, map, player, enemies = []) {
    ctx.save();
    ctx.scale(this.zoom, this.zoom);
    ctx.translate(-this.x, -this.y);

    map.render(ctx, this);

    enemies.forEach((enemy) => enemy.render(ctx));

    player.render(ctx);

    ctx.restore();
  }
}
