import { Character } from "./character.js";
import { Sprite } from "../utils/sprite.js";
import { Timer } from "../utils/timer.js";
import { EnemyIdleState } from "../states/idleState.js";
import { EnemyRunState } from "../states/runState.js";
import { AttackState } from "../states/attackState.js";
import { HitState } from "../states/hitState.js";
import { DeathState } from "../states/deathState.js";
import { checkCollision } from "../utils/collision.js";

export class Enemy extends Character {
  constructor(x, y, spriteManager, health, attackPower) {
    super(x, y, spriteManager, health, attackPower, "enemy");
    this.speed = 0.5;
    this.engageDistance = 200;
    this.disengageDistance = 300;
    this.attackDistance = 20;
    this.damageCooldown = new Timer(1000);
    this.attackCooldown = new Timer(500);
    this.collisionLayer = "enemy";
    this.initSprites();
    this.initStates();
    this.stateMachine.setState("idle");
  }

  initSprites() {
    // Placeholder function to be overridden by subclasses
  }

  initStates() {
    this.stateMachine.addState("idle", new EnemyIdleState(this));
    this.stateMachine.addState("run", new EnemyRunState(this));
    this.stateMachine.addState("attack", new AttackState(this));
    this.stateMachine.addState("hit", new HitState(this));
    this.stateMachine.addState("death", new DeathState(this));
  }

  handleMovement(player) {
    if (player.stateMachine.currentState.name === "death") {
      // Arrêter le mouvement si le joueur est mort
      this.stateMachine.setState("idle");
      return;
    }

    const distanceX = player.x - this.x;
    const distanceY = player.y - this.y;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    let newX = this.x;
    let newY = this.y;

    if (distanceX !== 0 || distanceY !== 0) {
      const moveX = (distanceX / distance) * this.speed;
      const moveY = (distanceY / distance) * this.speed;

      newX += moveX;
      newY += moveY;

      if (Math.abs(distanceX) > Math.abs(distanceY)) {
        this.direction = distanceX > 0 ? "right" : "left";
      } else {
        this.direction = distanceY > 0 ? "down" : "up";
      }
    }

    // Vérifiez les collisions avant de mettre à jour la position
    const newBoundingBox = {
      x: newX,
      y: newY,
      width: this.width,
      height: this.height,
    };

    if (!checkCollision(newBoundingBox, player.getBoundingBox())) {
      this.x = newX;
      this.y = newY;
    }
  }

  update(deltaTime, player) {
    super.update(deltaTime, [player]);
  }
}
