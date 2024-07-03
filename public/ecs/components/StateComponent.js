export class StateComponent {
  constructor(initialState) {
    this.name = "state";
    this.currentState = initialState;
    this.states = {};
  }

  addState(name, state) {
    this.states[name] = state;
  }

  setState(name) {
    if (this.currentState && this.states[this.currentState].exit) {
      this.states[this.currentState].exit();
    }
    this.currentState = name;
    if (this.states[this.currentState].enter) {
      this.states[this.currentState].enter();
    }
  }

  update(deltaTime, entities) {
    if (
      this.states[this.currentState] &&
      this.states[this.currentState].update
    ) {
      this.states[this.currentState].update(deltaTime, entities);
    }
  }
}
