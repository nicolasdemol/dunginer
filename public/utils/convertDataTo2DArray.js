export function convertDataTo2DArray(data, width) {
  const height = data.length / width;
  const array = [];
  for (let y = 0; y < height; y++) {
    const row = data.slice(y * width, (y + 1) * width);
    array.push(row);
  }
  return array;
}

