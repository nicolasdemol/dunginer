import { Character } from "./character.js";
import { Sprite } from "../utils/sprite.js";
import { Timer } from "../utils/timer.js";

export class Enemy extends Character {
  constructor(x, y, spriteManager, health, attackPower) {
    super(x, y, spriteManager, health, attackPower, "enemy");
    this.speed = 0.5;
    this.engageDistance = 200;
    this.disengageDistance = 300;
    this.attackDistance = 20;
    this.damageCooldown = new Timer(1000);
    this.attackCooldown = new Timer(500);
    this.sprites = {
      idle: new Sprite(this.spriteManager.getSprite("enemy_idle"), 8, 16, 16),
      run: new Sprite(this.spriteManager.getSprite("enemy_run"), 8, 16, 17),
      attack: new Sprite(
        this.spriteManager.getSprite("enemy_attack"),
        8,
        48,
        48
      ),
      hit: new Sprite(this.spriteManager.getSprite("enemy_hit"), 8, 16, 20),
    };
  }

  handleMovement(player) {
    const distanceX = player.x - this.x;
    const distanceY = player.y - this.y;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (distanceX !== 0 || distanceY !== 0) {
      const moveX = (distanceX / distance) * this.speed;
      const moveY = (distanceY / distance) * this.speed;

      this.x += moveX;
      this.y += moveY;

      if (Math.abs(distanceX) > Math.abs(distanceY)) {
        this.direction = distanceX > 0 ? "right" : "left";
      } else {
        this.direction = distanceY > 0 ? "down" : "up";
      }
    }
  }

  update(deltaTime, player) {
    super.update(deltaTime, [player]);
  }
}
