export class ObjectLayer {
  constructor(objects, spriteManager) {
    this.objects = objects;
    this.spriteManager = spriteManager;
  }

  render(ctx, camera) {
    this.objects.forEach((obj) => {
      const sprite = this.spriteManager.getSprite(obj.spriteName);
      if (sprite) {
        sprite.draw(
          ctx,
          obj.tileIndex,
          Math.round(obj.x - camera.x),
          Math.round(obj.y - camera.y)
        );
      }
    });
  }
}
