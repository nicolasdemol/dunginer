import { State } from "./state.js";

export class RunState extends State {
  constructor(character) {
    super("run", character);
  }

  enter() {
    this.character.state = "run";
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

        if (
          distance < this.character.attackDistance &&
          this.character.attackCooldown.isFinished()
        ) {
          this.character.stateMachine.setState("attack");
        } else if (distance > this.character.disengageDistance) {
          this.character.stateMachine.setState("idle");
        } else {
          this.character.handleMovement(entity);
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
