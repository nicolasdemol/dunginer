import { State } from "./state.js";

export class IdleState extends State {
  constructor(character) {
    super("idle", character);
  }

  enter() {
    this.character.state = "idle";
  }

  update(deltaTime, entities) {
    this.character.updateAnimation(deltaTime);
    if (this.character.type === "enemy") {
      entities.forEach((entity) => {
        const distanceX = entity.x - this.character.x;
        const distanceY = entity.y - this.character.y;
        const distance = Math.sqrt(
          distanceX * distanceX + distanceY * distanceY
        );

        if (distance < this.character.engageDistance) {
          this.character.stateMachine.setState("run");
        }
      });
    }

    if (this.character.type === "player") {
      if (this.character.inputManager.isMouseClicked()) {
        this.character.stateMachine.setState("attack");
      }
    }
  }
}
