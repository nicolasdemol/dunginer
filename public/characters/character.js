import { Timer } from "../utils/timer.js";

export class Character {
  constructor(x, y, spriteManager, health, attackPower) {
    this.x = x;
    this.y = y;
    this.spriteManager = spriteManager;
    this.direction = "down";
    this.state = "idle";
    this.frame = 0;
    this.speed = 1;
    this.frameCount = 0;
    this.health = health;
    this.attackPower = attackPower;
    this.attackCooldown = new Timer(500); // Cooldown des attaques en millisecondes
    this.hitDuration = new Timer(1000); // Durée de l'état "hit" en millisecondes
    this.sprites = {};
  }

  render(ctx) {
    const sprite = this.getCurrentSprite();
    const tileIndex = this.getTileIndex();
    const scale = 1.4;

    const offsetX =
      (this.sprites["attack"].tileWidth - this.sprites["idle"].tileWidth) / 2;
    const offsetY =
      (this.sprites["attack"].tileHeight - this.sprites["idle"].tileHeight) / 2;

    let dx = Math.round(this.x);
    let dy = Math.round(this.y);

    if (this.state === "attack") {
      dx -= Math.round(offsetX * scale);
      dy -= Math.round(offsetY * scale);
    }

    sprite.draw(ctx, tileIndex, dx, dy, scale);
  }

  update(deltaTime) {
    this.attackCooldown.update(deltaTime);
    this.hitDuration.update(deltaTime);

    this.frameCount += deltaTime;
    if (this.frameCount >= 100) {
      // Ajuster ce chiffre pour contrôler la vitesse de l'animation
      this.frame = (this.frame + 1) % this.sprites[this.state].columns;
      this.frameCount = 0;
    }
  }

  takeDamage(damage) {
    if (this.hitDuration.isFinished()) {
      this.health -= damage;
      if (this.health <= 0) {
        this.die();
      } else {
        this.state = "hit";
        this.hitDuration.reset();
      }
    }
  }

  die() {
    console.log(`${this.constructor.name} is dead`);
  }

  getCurrentSprite() {
    return this.sprites[this.state];
  }

  getTileIndex() {
    let directionIndex;
    switch (this.direction) {
      case "left":
        directionIndex = 3;
        break;
      case "right":
        directionIndex = 1;
        break;
      case "up":
        directionIndex = 2;
        break;
      case "down":
        directionIndex = 0;
        break;
      default:
        directionIndex = 0;
    }
    return directionIndex * this.sprites[this.state].columns + this.frame;
  }
}
