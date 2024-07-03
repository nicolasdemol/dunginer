export class AnimationManager {
  constructor(character) {
    this.character = character; // Référence au personnage
    this.animations = {};
    this.currentAnimation = null;
    this.frameCount = 0;
    this.frameDuration = 100;
  }

  addAnimation(name, sprite, frameDuration = 100) {
    this.animations[name] = {
      sprite: sprite,
      frameDuration: frameDuration,
      currentFrame: 0,
    };
  }

  setAnimation(name) {
    if (this.currentAnimation !== name) {
      this.currentAnimation = name;
      this.animations[name].currentFrame = 0;
      this.frameCount = 0;
    }
  }

  update(deltaTime) {
    if (this.currentAnimation) {
      this.frameCount += deltaTime;
      if (
        this.frameCount >= this.animations[this.currentAnimation].frameDuration
      ) {
        this.animations[this.currentAnimation].currentFrame =
          (this.animations[this.currentAnimation].currentFrame + 1) %
          this.animations[this.currentAnimation].sprite.columns;
        this.frameCount = 0;
      }
    }
  }

  draw(ctx, x, y, scale = 1) {
    if (this.currentAnimation) {
      const animation = this.animations[this.currentAnimation];
      const sprite = animation.sprite;
      const frame = animation.currentFrame;
      const tileIndex = this.getTileIndex(
        sprite,
        frame,
        this.character.direction
      );
      const dx = Math.round(x - (sprite.tileWidth * scale) / 2);
      const dy = Math.round(y - (sprite.tileHeight * scale) / 2);

      sprite.draw(ctx, tileIndex, dx, dy, scale);
    }
  }

  getTileIndex(sprite, frame, direction) {
    const directions = ["down", "right", "up", "left"];
    const directionIndex = directions.indexOf(direction);
    return directionIndex * sprite.columns + frame;
  }

  isAnimationFinished() {
    if (this.currentAnimation) {
      const animation = this.animations[this.currentAnimation];
      return animation.currentFrame === animation.sprite.columns - 1;
    }
    return false;
  }
}
