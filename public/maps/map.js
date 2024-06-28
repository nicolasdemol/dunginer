import { TileLayer } from "./tileLayer.js";
import { ObjectLayer } from "./objectLayer.js";
import { Sprite } from "../utils/sprite.js";

export class Map {
  constructor(mapConfig, spriteManager) {
    this.tileWidth = mapConfig.tilewidth;
    this.tileHeight = mapConfig.tileheight;
    this.spriteManager = spriteManager;
    this.layers = [];
    this.sprites = {
      foreground_lava: new Sprite(
        this.spriteManager.getSprite("foreground_lava"),
        15,
        16,
        16
      ),
    };

    mapConfig.layers.forEach((layer, index) => {
      if (layer.type === "tilelayer") {
        const sprite = this.getCurrentSprite(mapConfig.tilesets[index].name);
        const tileLayer = new TileLayer(
          layer,
          this.tileWidth,
          this.tileHeight,
          sprite
        );
        this.layers.push(tileLayer);
      } else if (layer.type === "objectgroup") {
        const objectLayer = new ObjectLayer(layer.objects, this.spriteManager);
        this.layers.push(objectLayer);
      }
    });
  }

  render(ctx, camera) {
    this.layers.forEach((layer) => {
      layer.render(ctx, camera);
    });
  }

  getCurrentSprite(spriteName) {
    return this.sprites[spriteName];
  }
}
