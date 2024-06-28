import { Character } from "./character.js";

export class Enemy extends Character {
  constructor(x, y, spriteManager, health, attackPower) {
    super(x, y, spriteManager, health, attackPower);
    this.speed = 0.5; // Vitesse par défaut pour tous les ennemis
    this.engageDistance = 300; // Distance pour commencer à attaquer
    this.disengageDistance = 300; // Distance pour arrêter de poursuivre
    this.attackDistance = 15; // Distance pour attaquer le joueur
  }

  update(player) {
    super.update();

    const distanceX = player.x - this.x;
    const distanceY = player.y - this.y;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (distance < this.attackDistance && this.attackCooldown === 0) {
      this.startAttack(player);
    } else if (distance < this.engageDistance) {
      this.moveTowards(player);
    } else if (distance > this.disengageDistance) {
      this.state = "idle"; // Retour à l'état idle
    }

    if (this.attackCooldown > 0) {
      this.attackCooldown--;
    }
  }

  startAttack(player) {
    this.state = "attack";
    this.frame = 0;
    this.frameCount = 0;
    this.attacking = true;
    this.attack(player);
    this.attackCooldown = 20; // Temps de cooldown entre les attaques
  }

  moveTowards(player) {
    const distanceX = player.x - this.x;
    const distanceY = player.y - this.y;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (distanceX !== 0 || distanceY !== 0) {
      this.state = "run";

      const moveX = (distanceX / distance) * this.speed;
      const moveY = (distanceY / distance) * this.speed;

      this.x += moveX;
      this.y += moveY;

      if (Math.abs(distanceX) > Math.abs(distanceY)) {
        this.direction = distanceX > 0 ? "right" : "left";
      } else {
        this.direction = distanceY > 0 ? "down" : "up";
      }
    } else {
      this.state = "idle";
    }
  }

  attack(player) {
    // Infliger des dégâts au joueur
    player.takeDamage(this.attackPower);
  }
}
