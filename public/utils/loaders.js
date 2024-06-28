// scripts/api.js
export async function loadMapConfig(map) {
  const response = await fetch(`/api/maps/${map}`);
  if (!response.ok) {
    throw new Error("Map not found");
  }
  const data = await response.json();
  return data;
}

export async function loadLevelConfig(level) {
  const response = await fetch(`/api/levels/${level}`);
  if (!response.ok) {
    throw new Error("Level not found");
  }
  const data = await response.json();
  return data;
}
