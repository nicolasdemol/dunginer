import { Character } from "./character.js";
import { Sprite } from "../utils/sprite.js";
import { Timer } from "../utils/timer.js";

export class Player extends Character {
  constructor(x, y, spriteManager, inputManager) {
    super(x, y, spriteManager, 100, 10, "player");
    this.inputManager = inputManager;
    this.speed = 2;
    this.damageCooldown = new Timer(250);
    this.attackCooldown = new Timer(250);
    this.attackDistance = 40;
    this.sprites = {
      idle: new Sprite(
        this.spriteManager.getSprite("blue_knight_idle"),
        8,
        16,
        16
      ),
      run: new Sprite(
        this.spriteManager.getSprite("blue_knight_run"),
        8,
        16,
        17
      ),
      attack: new Sprite(
        this.spriteManager.getSprite("blue_knight_attack"),
        8,
        48,
        48
      ),
      hit: new Sprite(
        this.spriteManager.getSprite("blue_knight_hit"),
        8,
        16,
        20
      ),
    };
  }

  handleMovement() {
    let isMoving = false;

    if (this.inputManager.isKeyPressed("left")) {
      this.x -= this.speed;
      this.direction = "left";
      isMoving = true;
    }
    if (this.inputManager.isKeyPressed("right")) {
      this.x += this.speed;
      this.direction = "right";
      isMoving = true;
    }
    if (this.inputManager.isKeyPressed("up")) {
      this.y -= this.speed;
      this.direction = "up";
      isMoving = true;
    }
    if (this.inputManager.isKeyPressed("down")) {
      this.y += this.speed;
      this.direction = "down";
      isMoving = true;
    }

    if (isMoving && this.state !== "attack" && this.state !== "hit") {
      this.stateMachine.setState("run");
    } else if (!isMoving && this.state !== "attack" && this.state !== "hit") {
      this.stateMachine.setState("idle");
    }

    return isMoving;
  }

  update(deltaTime, enemies) {
    super.update(deltaTime, enemies);
    this.handleMovement();
  }
}
