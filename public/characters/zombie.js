import { Enemy } from "./enemy.js";
import { Sprite } from "../utils/sprite.js";

export class Zombie extends Enemy {
  constructor(x, y, spriteManager, map) {
    super(x, y, spriteManager, 30, 10, map); // Santé et puissance d'attaque pour le zombie
    this.initSprites();
  }

  initSprites() {
    const idleSprite = this.spriteManager.getSprite("zombie_idle");
    const runSprite = this.spriteManager.getSprite("zombie_run");
    const attackSprite = this.spriteManager.getSprite("zombie_attack");
    const hitSprite = this.spriteManager.getSprite("zombie_hit");
    const deathSprite = this.spriteManager.getSprite("zombie_death");

    if (
      !idleSprite ||
      !runSprite ||
      !attackSprite ||
      !hitSprite ||
      !deathSprite
    ) {
      console.error("Failed to load one or more sprites for Zombie.");
      return;
    }

    this.animationManager.addAnimation(
      "idle",
      new Sprite(idleSprite, 8, 16, 16)
    );
    this.animationManager.addAnimation("run", new Sprite(runSprite, 8, 16, 16));
    this.animationManager.addAnimation(
      "attack",
      new Sprite(attackSprite, 8, 16, 16)
    );
    this.animationManager.addAnimation("hit", new Sprite(hitSprite, 1, 16, 16));
    this.animationManager.addAnimation(
      "death",
      new Sprite(deathSprite, 8, 16, 48)
    );
  }
}
