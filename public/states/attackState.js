import { State } from "./state.js";

export class AttackState extends State {
  constructor(character) {
    super("attack", character);
  }

  enter() {
    this.character.animationManager.setAnimation("attack");
    this.character.state = "attack";
    this.character.attackCooldown.reset(); // Reset hit duration to manage attack animation duration
  }

  update(deltaTime, entities) {
    if (this.character.attackCooldown.isFinished()) {
      this.character.attack(entities);
      this.character.stateMachine.setState("idle");
    }
  }
}
