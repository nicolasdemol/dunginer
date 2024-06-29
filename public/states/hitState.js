import { State } from "./state.js";

export class HitState extends State {
  constructor(character) {
    super("hit", character);
  }

  enter() {
    this.character.state = "hit";
    this.character.frame = 0;
    this.character.frameCount = 0;
    this.character.damageCooldown.reset();
  }

  update(deltaTime, entities) {
    this.character.updateAnimation(deltaTime);
    if (this.character.damageCooldown.isFinished()) {
      this.character.stateMachine.setState("idle");
    }
  }
}
