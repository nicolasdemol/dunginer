export class InputManager {
  constructor() {
    this.keys = {
      left: false,
      right: false,
      up: false,
      down: false,
    };
    this.mouse = {
      clicked: false,
    };

    this.bindEvents();
  }

  bindEvents() {
    window.addEventListener("keydown", (e) => this.handleKeyDown(e));
    window.addEventListener("keyup", (e) => this.handleKeyUp(e));
    window.addEventListener("mousedown", () => this.handleMouseDown());
    window.addEventListener("mouseup", () => this.handleMouseUp());
  }

  handleKeyDown(event) {
    switch (event.key) {
      case "q":
        this.keys.left = true;
        break;
      case "d":
        this.keys.right = true;
        break;
      case "z":
        this.keys.up = true;
        break;
      case "s":
        this.keys.down = true;
        break;
    }
  }

  handleKeyUp(event) {
    switch (event.key) {
      case "q":
        this.keys.left = false;
        break;
      case "d":
        this.keys.right = false;
        break;
      case "z":
        this.keys.up = false;
        break;
      case "s":
        this.keys.down = false;
        break;
    }
  }

  handleMouseDown() {
    this.mouse.clicked = true;
  }

  handleMouseUp() {
    this.mouse.clicked = false;
  }

  isKeyPressed(key) {
    return this.keys[key];
  }

  isMouseClicked() {
    return this.mouse.clicked;
  }
}
