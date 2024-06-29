import { TileLayer } from "./tileLayer.js";
import { ObjectLayer } from "./objectLayer.js";
import { Sprite } from "../utils/sprite.js";

export class Map {
  constructor(mapConfig, spriteManager) {
    this.tileWidth = mapConfig.tilewidth;
    this.tileHeight = mapConfig.tileheight;
    this.spriteManager = spriteManager;
    this.layers = [];
    this.damageTiles = {}; // Stocker les tuiles de dégâts
    this.sprites = {
      foreground_lava: new Sprite(
        this.spriteManager.getSprite("foreground_lava"),
        15,
        16,
        16
      ),
    };

    // Charger les propriétés des tuiles de dégâts
    mapConfig.tilesets.forEach((tileset) => {
      if (tileset.tiles) {
        tileset.tiles.forEach((tile) => {
          let damageProperty = tile.properties.find(
            (prop) => prop.name === "damage"
          );
          if (damageProperty) {
            this.damageTiles[tileset.firstgid + tile.id] = damageProperty.value;
          }
        });
      }
    });

    // Charger les couches
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

  // Nouvelle méthode pour vérifier si une tuile est une tuile de dégâts
  isDamageTile(tileGid) {
    return this.damageTiles[tileGid] !== undefined;
  }

  // Nouvelle méthode pour obtenir les dégâts d'une tuile
  getTileDamage(tileGid) {
    return this.damageTiles[tileGid] || 0;
  }
}
