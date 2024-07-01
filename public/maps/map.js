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
    this.damageTilePositions = []; // Stocker les positions des tuiles de dégâts
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

    // Charger les couches et stocker les positions des tuiles de dégâts
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

        // Stocker les positions des tuiles de dégâts
        for (let y = 0; y < tileLayer.mapTiles.length; y++) {
          for (let x = 0; x < tileLayer.mapTiles[y].length; x++) {
            const tileGID = tileLayer.mapTiles[y][x];
            if (this.isDamageTile(tileGID)) {
              this.damageTilePositions.push({
                x: x * this.tileWidth,
                y: y * this.tileHeight,
                damage: this.getTileDamage(tileGID),
              });
            }
          }
        }
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

  // Nouvelle méthode pour obtenir les dégâts à une position donnée
  getDamageAtPosition(x, y) {
    for (let pos of this.damageTilePositions) {
      if (
        pos.x <= x &&
        x < pos.x + this.tileWidth &&
        pos.y <= y &&
        y < pos.y + this.tileHeight
      ) {
        return pos.damage;
      }
    }
    return 0;
  }

  // Nouvelle méthode pour obtenir le coût de mouvement
  getMovementCost(x, y) {
    const tileGid = this.getTileGidAtPosition(x, y);
    if (this.isDamageTile(tileGid)) {
      return 10; // Coût élevé pour éviter les tuiles dangereuses
    }
    return 1; // Coût normal pour les autres tuiles
  }

  getTileGidAtPosition(x, y) {
    const col = Math.floor(x / this.tileWidth);
    const row = Math.floor(y / this.tileHeight);
    for (let layer of this.layers) {
      if (layer instanceof TileLayer) {
        const tileGid = layer.getTileGidAt(col, row);
        if (tileGid) {
          return tileGid;
        }
      }
    }
    return null;
  }
}
