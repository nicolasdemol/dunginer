import { State } from "./state.js";

export class HitState extends State {
  constructor(character) {
    super("hit", character);
  }

  enter() {
    this.character.animationManager.setAnimation("hit");
    this.character.state = "hit";
    this.character.frame = 0;
    this.character.frameCount = 0;
    this.character.damageCooldown.reset();
  }

  update(deltaTime, entities) {
    if (this.character.damageCooldown.isFinished()) {
      this.character.stateMachine.setState("idle");
    }
  }
}
