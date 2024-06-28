import { Character } from "./character.js";
import { Sprite } from "../utils/sprite.js";
import { Timer } from "../utils/timer.js";

export class Player extends Character {
  constructor(x, y, spriteManager, inputManager) {
    super(x, y, spriteManager, 100, 10); // Santé et puissance d'attaque
    this.inputManager = inputManager;
    this.speed = 1;
    this.attacking = false; // Nouvel état pour suivre si le joueur est en train d'attaquer
    this.attackStarted = false; // Nouvel état pour suivre si l'attaque a déjà commencé
    this.damageCooldown = new Timer(500); // Cooldown des dégâts en millisecondes
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
      hit: new Sprite(
        this.spriteManager.getSprite("blue_knight_hit"),
        8,
        16,
        20
      ),
    };
  }

  update(deltaTime, enemies) {
    super.update(deltaTime);

    if (this.state === "hit") {
      if (this.hitDuration.isFinished()) {
        this.state = "idle"; // Retourner à l'état idle après la durée du hit
      }
      return;
    }

    if (this.attacking) {
      this.handleAttackAnimation(enemies, deltaTime);
    }

    let moved = false;

    if (
      this.inputManager.isMouseClicked() &&
      this.attackCooldown.isFinished() &&
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

    // Réinitialiser l'état attackStarted si la souris n'est pas cliquée
    if (!this.inputManager.isMouseClicked()) {
      this.attackStarted = false;
    }

    // Mettre à jour le cooldown des dégâts
    this.damageCooldown.update(deltaTime);
  }

  startAttack(enemies) {
    this.state = "attack";
    this.frame = 0;
    this.frameCount = 0;
    this.attacking = true;
    this.attackStarted = true; // Marquer l'attaque comme commencée
    this.attack(enemies);
    this.attackCooldown.start(); // Réinitialiser le cooldown des attaques
  }

  handleAttackAnimation(enemies, deltaTime) {
    this.frameCount += deltaTime;
    if (this.frameCount >= 100) {
      // Ajuster ce chiffre pour contrôler la vitesse de l'animation
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
    // Attaquer les ennemis dans une certaine distance
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

  takeDamage(damage) {
    // Appliquer des dégâts seulement si le cooldown n'est pas actif
    if (this.damageCooldown.isFinished()) {
      super.takeDamage(damage);
      this.frame = 0;
      this.frameCount = 0;
      this.damageCooldown.start(); // Réinitialiser le cooldown des dégâts
    }
  }
}
