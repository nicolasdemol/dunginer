import { Timer } from "../utils/timer.js";
import { StateMachine } from "../states/stateMachine.js";
import { IdleState } from "../states/idleState.js";
import { RunState } from "../states/runState.js";
import { AttackState } from "../states/attackState.js";
import { HitState } from "../states/hitState.js";

export class Character {
  constructor(x, y, spriteManager, health, attackPower, type) {
    this.x = x;
    this.y = y;
    this.spriteManager = spriteManager;
    this.health = health;
    this.attackPower = attackPower;
    this.attackDistance = 30;
    this.state = "idle";
    this.frame = 0;
    this.speed = 1;
    this.frameCount = 0;
    this.frameDuration = 100;
    this.attackCooldown = new Timer(500);
    this.damageCooldown = new Timer(500);
    this.sprites = {};
    this.stateMachine = new StateMachine(this);
    this.type = type;

    this.initStates();
    this.stateMachine.setState("idle"); // Définir l'état initial ici
  }

  initStates() {
    this.stateMachine.addState("idle", new IdleState(this));
    this.stateMachine.addState("run", new RunState(this));
    this.stateMachine.addState("attack", new AttackState(this));
    this.stateMachine.addState("hit", new HitState(this));
  }

  update(deltaTime, entities) {
    this.attackCooldown.update(deltaTime);
    this.damageCooldown.update(deltaTime);
    this.stateMachine.update(deltaTime, entities);
    this.updateAnimation(deltaTime);
  }

  render(ctx) {
    const sprite = this.getCurrentSprite();
    const tileIndex = this.getTileIndex();
    const scale = 1.4;

    const dx = Math.round(this.x - (sprite.tileWidth * scale) / 2);
    const dy = Math.round(this.y - (sprite.tileHeight * scale) / 2);

    sprite.draw(ctx, tileIndex, dx, dy, scale);
  }

  updateAnimation(deltaTime) {
    this.frameCount += deltaTime;
    if (this.frameCount >= this.frameDuration) {
      this.frame = (this.frame + 1) % this.sprites[this.state].columns;
      this.frameCount = 0;
    }
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
