export class AssetLoader {
  constructor(spriteManager) {
    this.spriteManager = spriteManager;
  }

  async loadAssets(assets) {
    const promises = assets.map(({ name, url }) =>
      this.spriteManager.loadSprite(name, url)
    );
    await Promise.all(promises);
  }
}
