import { Player } from "./characters/player.js";
import { Zombie } from "./characters/zombie.js";
import { Camera } from "./utils/camera.js";
import { Map } from "./maps/map.js";
import { AssetLoader } from "./utils/assetLoader.js";
import { InputManager } from "./utils/inputManager.js";
import { SpriteManager } from "./utils/spriteManager.js";
import { loadLevelConfig, loadMapConfig } from "./utils/loaders.js";
import { assets } from "./utils/assets.js";

class Game {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.spriteManager = new SpriteManager();
    this.assetLoader = new AssetLoader(this.spriteManager);
    this.ctx.imageSmoothingEnabled = false;
    this.inputManager = new InputManager();
    this.currentFrame = 0;
    this.enemies = [];
    this.levelConfig = {};
    this.mapConfig = {};
    this.map = null;
    this.camera = null;
    this.lastTime = 0;
    this.init();
  }

  async init() {
    this.levelConfig = await loadLevelConfig(1);
    this.mapConfig = await loadMapConfig(1);

    await this.assetLoader.loadAssets(assets);

    this.map = new Map(this.mapConfig, this.spriteManager);

    this.player = new Player(
      this.levelConfig.playerStart.x * this.mapConfig.tilewidth,
      this.levelConfig.playerStart.y * this.mapConfig.tileheight,
      this.spriteManager,
      this.inputManager
    );

    this.levelConfig.enemies.forEach((enemyData) => {
      const x = enemyData.x * this.mapConfig.tilewidth;
      const y = enemyData.y * this.mapConfig.tileheight;

      if (enemyData.type === "zombie") {
        this.enemies.push(new Zombie(x, y, this.spriteManager, this.map));
      } else if (enemyData.type === "slime") {
        this.enemies.push(new Slime(x, y, this.spriteManager, this.map));
      }
    });

    this.resizeCanvas();
    window.addEventListener("resize", () => this.resizeCanvas());

    this.camera = new Camera(
      0,
      0,
      this.canvas.width,
      this.canvas.height,
      this.mapConfig.width * this.mapConfig.tilewidth,
      this.mapConfig.height * this.mapConfig.tileheight
    );

    window.addEventListener("blur", () => this.onBlur());
    window.addEventListener("focus", () => this.onFocus());

    this.startGame();
  }

  onBlur() {
    console.log("Window lost focus. Resetting input states.");
    this.inputManager.resetInputs();
    this.player.resetActions();
  }

  onFocus() {
    console.log("Window gained focus.");
    // Vous pouvez également réinitialiser d'autres états si nécessaire
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  startGame() {
    this.lastTime = performance.now();
    this.gameLoop(this.lastTime);
  }

  updateGame(deltaTime) {
    this.player.update(deltaTime, this.enemies, this.map);
    this.camera.follow(this.player);

    this.enemies.forEach((enemy) => {
      enemy.update(deltaTime, this.player, this.map);
    });

    // Supprimer les ennemis morts
    this.enemies = this.enemies.filter((enemy) => !enemy.isDead);

    // Gérer la mort du joueur
    if (this.player.isDead) {
      // Gérer la mort du joueur (par exemple, afficher un écran de fin de jeu)
      console.log("Game Over");
    }
  }

  drawGame() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.camera.render(this.ctx, this.map, this.player, this.enemies);
    this.drawHUD(); // Appel de la méthode pour dessiner le HUD
  }

  drawHUD() {
    const ctx = this.ctx;
    const playerHealth = this.player.health;
    const maxHealth = 100;
    const healthBarWidth = 200;
    const healthBarHeight = 20;
    const healthBarX = 20;
    const healthBarY = 20;

    // Dessiner la barre de vie de fond (vide)
    ctx.fillStyle = "#444";
    ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);

    // Dessiner la barre de vie actuelle
    ctx.fillStyle = "#f00";
    ctx.fillRect(
      healthBarX,
      healthBarY,
      (playerHealth / maxHealth) * healthBarWidth,
      healthBarHeight
    );

    // Dessiner le contour de la barre de vie
    ctx.strokeStyle = "#fff";
    ctx.strokeRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);

    // Dessiner le texte de la barre de vie
  }

  gameLoop(timestamp) {
    const deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;

    this.updateGame(deltaTime);
    this.drawGame();

    requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.game = new Game("game");
});
