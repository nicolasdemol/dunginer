import { State } from "./state.js";

export class HitState extends State {
  constructor(character) {
    super("hit", character);
    this.damage = 0; // Initialiser les dégâts à 0
  }

  setDamage(damage) {
    this.damage = damage;
  }

  enter() {
    this.character.animationManager.setAnimation("hit");
    this.character.state = "hit";
    this.applyDamage(); // Appliquer les dégâts
    this.character.applySlow(0.5, 2000); // Appliquer un ralentissement de 50% pendant 2 secondes
    this.character.damageCooldown.reset();
  }

  applyDamage() {
    this.character.health -= this.damage;
    console.log(`Health ${this.character.type}`, this.character.health);
    if (this.character.health <= 0) {
      this.character.stateMachine.setState("death");
    }
  }

  update(deltaTime, entities) {
    if (
      this.character.damageCooldown.isFinished() &&
      this.character.health > 0
    ) {
      this.character.stateMachine.setState("idle");
    }
  }

  exit() {
    // No cleanup needed for death state
  }
}
