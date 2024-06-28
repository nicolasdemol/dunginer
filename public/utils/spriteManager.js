export class SpriteManager {
  constructor() {
    this.sprites = {};
  }

  loadSprite(name, src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        this.sprites[name] = img;
        resolve();
      };
      img.onerror = reject;
    });
  }

  getSprite(name) {
    return this.sprites[name];
  }
}
