class Node {
  constructor(x, y, cost, heuristic, parent = null) {
    this.x = x;
    this.y = y;
    this.cost = cost;
    this.heuristic = heuristic;
    this.parent = parent;
  }

  get totalCost() {
    return this.cost + this.heuristic;
  }
}

function heuristic(a, b) {
  const D = 1;
  const D2 = Math.sqrt(2);
  const dx = Math.abs(a.x - b.x);
  const dy = Math.abs(a.y - b.y);
  return D * (dx + dy) + (D2 - 2 * D) * Math.min(dx, dy);
}

export function aStarPathfinding(start, goal, map) {
  const openSet = [];
  const closedSet = new Set();
  openSet.push(new Node(start.x, start.y, 0, heuristic(start, goal)));

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.totalCost - b.totalCost);
    const currentNode = openSet.shift();

    if (currentNode.x === goal.x && currentNode.y === goal.y) {
      const path = [];
      let node = currentNode;
      while (node !== null) {
        path.push({ x: node.x, y: node.y });
        node = node.parent;
      }
      return path.reverse();
    }

    closedSet.add(`${currentNode.x},${currentNode.y}`);

    const neighbors = [
      { x: currentNode.x + 1, y: currentNode.y },
      { x: currentNode.x - 1, y: currentNode.y },
      { x: currentNode.x, y: currentNode.y + 1 },
      { x: currentNode.x, y: currentNode.y - 1 },
      { x: currentNode.x + 1, y: currentNode.y + 1 },
      { x: currentNode.x - 1, y: currentNode.y - 1 },
      { x: currentNode.x + 1, y: currentNode.y - 1 },
      { x: currentNode.x - 1, y: currentNode.y + 1 },
    ];

    for (const neighbor of neighbors) {
      if (closedSet.has(`${neighbor.x},${neighbor.y}`)) continue;

      const movementCost = map.getMovementCost(neighbor.x, neighbor.y);
      if (movementCost === Infinity) continue;

      const cost = currentNode.cost + movementCost;
      const heuristicValue = heuristic(neighbor, goal);
      const neighborNode = new Node(
        neighbor.x,
        neighbor.y,
        cost,
        heuristicValue,
        currentNode
      );

      const existingNode = openSet.find(
        (node) => node.x === neighbor.x && node.y === neighbor.y
      );
      if (existingNode) {
        if (neighborNode.totalCost < existingNode.totalCost) {
          openSet.splice(openSet.indexOf(existingNode), 1, neighborNode);
        }
      } else {
        openSet.push(neighborNode);
      }
    }
  }

  return []; // Retourner un tableau vide si aucun chemin n'est trouvé
}
