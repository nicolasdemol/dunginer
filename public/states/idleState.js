import { State } from "./state.js";

export class IdleState extends State {
  constructor(character) {
    super("idle", character);
  }

  enter() {
    this.character.animationManager.setAnimation("idle");
    this.character.state = "idle";
  }

  update(deltaTime, entities) {
  }
}

export class PlayerIdleState extends IdleState {
  update(deltaTime, entities) {
    super.update(deltaTime, entities);
    if (this.character.inputManager.isMouseClicked()) {
      this.character.stateMachine.setState("attack");
    }
  }
}

export class EnemyIdleState extends IdleState {
  update(deltaTime, entities) {
    super.update(deltaTime, entities);
    entities.forEach((entity) => {
      const distanceX = entity.x - this.character.x;
      const distanceY = entity.y - this.character.y;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      if (distance < this.character.engageDistance) {
        this.character.stateMachine.setState("run");
      }
    });
  }
}
