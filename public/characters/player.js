import { Character } from "./character.js";
import { Sprite } from "../utils/sprite.js";
import { Timer } from "../utils/timer.js";
import { PlayerIdleState } from "../states/idleState.js";
import { PlayerRunState } from "../states/runState.js";
import { AttackState } from "../states/attackState.js";
import { HitState } from "../states/hitState.js";

export class Player extends Character {
  constructor(x, y, spriteManager, inputManager) {
    super(x, y, spriteManager, 100, 10, "player");
    this.inputManager = inputManager;
    this.speed = 2;
    this.damageCooldown = new Timer(500);
    this.attackCooldown = new Timer(500);
    this.attackDistance = 40;
    this.initSprites();
    this.initStates();
    this.stateMachine.setState("idle");
  }

  initSprites() {
    this.animationManager.addAnimation(
      "idle",
      new Sprite(this.spriteManager.getSprite("blue_knight_idle"), 8, 16, 16)
    );
    this.animationManager.addAnimation(
      "run",
      new Sprite(this.spriteManager.getSprite("blue_knight_run"), 8, 16, 17)
    );
    this.animationManager.addAnimation(
      "attack",
      new Sprite(this.spriteManager.getSprite("blue_knight_attack"), 8, 48, 48)
    );
    this.animationManager.addAnimation(
      "hit",
      new Sprite(this.spriteManager.getSprite("blue_knight_hit"), 8, 16, 20)
    );
  }

  initStates() {
    this.stateMachine.addState("idle", new PlayerIdleState(this));
    this.stateMachine.addState("run", new PlayerRunState(this));
    this.stateMachine.addState("attack", new AttackState(this));
    this.stateMachine.addState("hit", new HitState(this));
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

  resetActions() {
    // Réinitialisez les actions du joueur ici
    this.stateMachine.setState("idle");
  }
}
