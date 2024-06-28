import { Character } from "./character.js";
import { Sprite } from "../utils/sprite.js";

export class Player extends Character {
  constructor(x, y, spriteManager, inputManager) {
    super(x, y, spriteManager, 100, 10); // Santé et puissance d'attaque
    this.inputManager = inputManager;
    this.speed = 1;
    this.attacking = false; // Nouvel état pour suivre si le joueur est en train d'attaquer
    this.attackStarted = false; // Nouvel état pour suivre si l'attaque a déjà commencé
    this.sprites = {
      idle: new Sprite(
        this.spriteManager.getSprite("blue_knight_idle"),
        8,
        16,
        16
      ),
      run: new Sprite(
        this.spriteManager.getSprite("blue_knight_run"),
        8,
        16,
        17
      ),
      attack: new Sprite(
        this.spriteManager.getSprite("blue_knight_attack"),
        8,
        48,
        48
      ),
    };
  }

  update(enemies) {
    super.update();

    if (this.attacking) {
      this.handleAttackAnimation(enemies);
    }

    let moved = false;

    if (
      this.inputManager.isMouseClicked() &&
      this.attackCooldown === 0 &&
      !this.attackStarted
    ) {
      this.startAttack(enemies);
    }

    if (this.inputManager.isKeyPressed("left")) {
      this.x -= this.speed;
      this.state = this.attacking ? "attack" : "run";
      this.direction = "left";
      moved = true;
    }
    if (this.inputManager.isKeyPressed("right")) {
      this.x += this.speed;
      this.state = this.attacking ? "attack" : "run";
      this.direction = "right";
      moved = true;
    }
    if (this.inputManager.isKeyPressed("up")) {
      this.y -= this.speed;
      this.state = this.attacking ? "attack" : "run";
      this.direction = "up";
      moved = true;
    }
    if (this.inputManager.isKeyPressed("down")) {
      this.y += this.speed;
      this.state = this.attacking ? "attack" : "run";
      this.direction = "down";
      moved = true;
    }

    if (!moved && !this.attacking) {
      this.state = "idle";
    }

    // Reset attackStarted state if mouse is not clicked
    if (!this.inputManager.isMouseClicked()) {
      this.attackStarted = false;
    }
  }

  startAttack(enemies) {
    this.state = "attack";
    this.frame = 0;
    this.frameCount = 0;
    this.attacking = true;
    this.attackStarted = true; // Marquer l'attaque comme commencée
    this.attack(enemies);
    this.attackCooldown = 20; // Temps de cooldown entre les attaques
  }

  handleAttackAnimation(enemies) {
    this.frameCount++;
    if (this.frameCount >= 10) {
      // Ajustez ce chiffre pour contrôler la vitesse de l'animation
      this.frame = (this.frame + 1) % this.sprites["attack"].columns;
      this.frameCount = 0;

      if (this.frame === 0) {
        this.attacking = false; // Fin de l'animation d'attaque
        this.state = "idle"; // Retour à l'état idle après l'attaque
      } else {
        // Infliger des dégâts aux ennemis proches à chaque frame d'attaque
        this.attack(enemies);
      }
    }
  }

  attack(enemies) {
    // Attaque les ennemis dans une certaine distance
    const attackRange = 20;
    enemies.forEach((enemy) => {
      const distanceX = enemy.x - this.x;
      const distanceY = enemy.y - this.y;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      if (distance < attackRange) {
        enemy.takeDamage(this.attackPower);
      }
    });
  }
}
