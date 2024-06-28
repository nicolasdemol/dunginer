import { Character } from "./character.js";
import { Timer } from "../utils/timer.js";

export class Enemy extends Character {
  constructor(x, y, spriteManager, health, attackPower) {
    super(x, y, spriteManager, health, attackPower);
    this.speed = 0.5; // Vitesse par défaut pour tous les ennemis
    this.engageDistance = 300; // Distance pour commencer à poursuivre
    this.disengageDistance = 300; // Distance pour arrêter de poursuivre
    this.attackDistance = 15; // Distance pour attaquer le joueur
    this.hitDuration = new Timer(1000); // Durée de l'état "hit" en millisecondes
    this.attackCooldown = new Timer(1000); // Cooldown des attaques en millisecondes
  }

  update(deltaTime, player) {
    super.update(deltaTime);

    if (this.state === "hit") {
      if (this.hitDuration.isFinished()) {
        this.state = "idle"; // Retourner à l'état idle après la durée du hit
      }
      return;
    }

    const distanceX = player.x - this.x;
    const distanceY = player.y - this.y;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (distance < this.attackDistance && this.attackCooldown.isFinished()) {
      this.startAttack(player);
    } else if (this.state !== "attack" && distance < this.engageDistance) {
      this.moveTowards(player);
    } else if (
      distance > this.disengageDistance ||
      this.attackCooldown.isFinished()
    ) {
      this.state = "idle"; // Retour à l'état idle
    }
    this.attackCooldown.update(deltaTime);
  }

  startAttack(player) {
    this.state = "attack";
    this.frame = 0;
    this.frameCount = 0;
    this.attack(player);
    this.attackCooldown.start(); // Réinitialiser le cooldown des attaques
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
    player.takeDamage(this.attackPower);
  }
}
