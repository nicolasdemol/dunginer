import { State } from "./state.js";

export class DeathState extends State {
  constructor(character) {
    super("death", character);
  }

  enter() {
    this.character.animationManager.setAnimation("death");
    this.character.animationManager.setAnimation("death");
    this.character.state = "death";
  }

  update(deltaTime) {
    if (this.character.animationManager.isAnimationFinished()) {
      this.character.die();
    }
  }

  exit() {
    // No cleanup needed for death state
  }
}
