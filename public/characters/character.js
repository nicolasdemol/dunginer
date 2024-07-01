import { Timer } from "../utils/timer.js";
import { StateMachine } from "../states/stateMachine.js";
import { AnimationManager } from "../utils/animationManager.js";

export class Character {
  constructor(x, y, spriteManager, health, attackPower, type) {
    this.x = x;
    this.y = y;
    this.width = 16; // Assurez-vous que la largeur est définie
    this.height = 16; // Assurez-vous que la hauteur est définie
    this.spriteManager = spriteManager;
    this.health = health;
    this.attackPower = attackPower;
    this.attackDistance = 30;
    this.state = "idle";
    this.frame = 0;
    this.speed = 1;
    this.frameCount = 0;
    this.frameDuration = 200;
    this.attackCooldown = new Timer(1000);
    this.damageCooldown = new Timer(500);
    this.sprites = {};
    this.stateMachine = new StateMachine(this);
    this.animationManager = new AnimationManager(this);
    this.direction = "down";
    this.collisionLayer = "default";
    this.type = type;
  }

  update(deltaTime, entities) {
    this.attackCooldown.update(deltaTime);
    this.damageCooldown.update(deltaTime);
    this.stateMachine.update(deltaTime, entities);
    this.animationManager.update(deltaTime);
  }

  render(ctx) {
    this.animationManager.draw(ctx, this.x, this.y, 1.4);
  }

  takeDamage(damage) {
    this.health -= damage;
    console.log(`Heath ${this.type}`, this.health);
    if (this.health <= 0) {
      this.die();
    } else {
      this.stateMachine.setState("hit");
    }
  }

  attack(entities) {
    entities.forEach((entity) => {
      const distanceX = entity.x - this.x;
      const distanceY = entity.y - this.y;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      if (distance < this.attackDistance) {
        entity.takeDamage(this.attackPower);
      }
    });
  }

  die() {
    console.log(`${this.constructor.name} is dead`);
  }

  getCurrentSprite() {
    return this.sprites[this.state];
  }

  getBoundingBox() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }
}
