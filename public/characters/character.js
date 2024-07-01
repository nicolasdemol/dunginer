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
    this.originalSpeed = this.speed; // Stocker la vitesse originale
    this.isSlowed = false;
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

    if (this.isSlowed) {
      this.slowTimer.update(deltaTime);
      if (this.slowTimer.isFinished()) {
        this.resetSpeed(); // Réinitialiser la vitesse après la fin du ralentissement
      }
    }

    this.stateMachine.update(deltaTime, entities);
    this.animationManager.update(deltaTime);

    this.validatePosition();
  }

  render(ctx) {
    this.animationManager.draw(ctx, this.x, this.y, 1.4);
  }

  takeDamage(damage) {
    if (this.state !== "hit") {
      const hitState = this.stateMachine.states["hit"];
      if (hitState && typeof hitState.setDamage === "function") {
        hitState.setDamage(damage);
        this.stateMachine.setState("hit");
      }
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

  applySlow(factor, duration) {
    this.speed *= factor; // Ralentir la vitesse
    this.isSlowed = true;
    this.slowTimer = new Timer(duration); // Réinitialiser le timer de ralentissement
    this.slowTimer.reset();
  }

  resetSpeed() {
    this.speed = this.originalSpeed; // Réinitialiser la vitesse à la valeur originale
    this.isSlowed = false;
  }

  validatePosition() {
    if (isNaN(this.x) || isNaN(this.y)) {
      console.error("Invalid position:", this.x, this.y);
      this.x = 0;
      this.y = 0;
    }
  }
}
