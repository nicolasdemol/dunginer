// Entity.js
export class Entity {
  constructor(id) {
    this.id = id;
    this.components = {};
  }

  addComponent(component) {
    this.components[component.name] = component;
    return this;
  }

  getComponent(name) {
    return this.components[name];
  }

  removeComponent(name) {
    delete this.components[name];
  }
}
