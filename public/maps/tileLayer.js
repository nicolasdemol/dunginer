import { convertDataTo2DArray } from "../utils/convertDataTo2DArray.js";

export class TileLayer {
  constructor(layerData, tileWidth, tileHeight, sprite) {
    this.mapTiles = convertDataTo2DArray(layerData.data, layerData.width);
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.sprite = sprite;
  }

  render(ctx, camera) {
    const startCol = Math.floor(camera.x / this.tileWidth);
    const endCol = startCol + Math.ceil(camera.width / this.tileWidth);
    const startRow = Math.floor(camera.y / this.tileHeight);
    const endRow = startRow + Math.ceil(camera.height / this.tileHeight);

    for (let y = startRow; y <= endRow; y++) {
      for (let x = startCol; x <= endCol; x++) {
        if (
          y >= 0 &&
          y < this.mapTiles.length &&
          x >= 0 &&
          x < this.mapTiles[y].length
        ) {
          const tileIndex = this.mapTiles[y][x] - 1;
          if (tileIndex >= 0 && this.sprite) {
            this.sprite.draw(
              ctx,
              tileIndex,
              Math.round(x * this.tileWidth),
              Math.round(y * this.tileHeight)
            );
          }
        }
      }
    }
  }
}
