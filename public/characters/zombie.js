import { Enemy } from "./enemy.js";
import { Sprite } from "../utils/sprite.js";

export class Zombie extends Enemy {
  constructor(x, y, spriteManager) {
    super(x, y, spriteManager, 30, 5); // Santé et puissance d'attaque pour le zombie
    this.sprites = {
      idle: new Sprite(this.spriteManager.getSprite("zombie_idle"), 8, 16, 16),
      run: new Sprite(this.spriteManager.getSprite("zombie_run"), 8, 16, 16),
      attack: new Sprite(
        this.spriteManager.getSprite("zombie_attack"),
        8,
        16,
        16
      ),
    };
  }
}
