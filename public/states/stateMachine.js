export class StateMachine {
  constructor(character) {
    this.character = character;
    this.states = {};
    this.currentState = null;
  }

  addState(name, state) {
    this.states[name] = state;
  }

  setState(name) {
    if (this.currentState && this.currentState.name === name) {
      return; // Ne changez pas d'état si l'état demandé est le même que l'état actuel
    }

    console.log(
      `Changing state ${this.character.type} to: ${name}`,
      this.states
    );
    if (this.currentState) {
      this.currentState.exit();
    }
    this.currentState = this.states[name];
    this.currentState.enter();
  }

  update(deltaTime, entities) {
    if (this.currentState) {
      this.currentState.update(deltaTime, entities);
    }
  }
}
