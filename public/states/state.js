export class State {
  constructor(name, character) {
    this.name = name;
    this.character = character;
  }

  enter() {}
  update(deltaTime, entities) {}
  exit() {}
}
