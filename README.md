# Dunginer

## Description

Dunginer is a 2D game where the player controls a blue knight navigating through a map filled with enemies such as zombies and slimes. The player must avoid lava and walls, attack enemies, and survive as long as possible.

## Features

- Player control with arrow keys (WASD).
- Attack enemies with a mouse click.
- Zombies and slimes with chasing behavior.
- Damage when standing on lava tiles.
- Collision detection with walls.

## Installation

1. Clone the repository:

```sh
git clone https://github.com/nicolasdemol/dunginer.git
```

2. Navigate to the project directory:

```sh
cd dunginer
```

3. Install the server dependancies

```sh
npm install
```

4. Launch the server to connect the frontend API with the server assets and ressources

```sh
node server.js
```

5. Open public/index.html in your browser to start the game.

File Structure public folder

- index.html: Main HTML file.
- game.js: Main game logic.
- characters/: Directory containing character classes.
- utils/: Directory containing utility classes and functions.
- assets/: Directory containing game assets.
- maps/: Directory containing map configurations (JSON files).

## How to Play

- Use the arrow keys (WASD) to move the blue knight.
- Click the mouse to attack enemies.
- Avoid standing on lava tiles to prevent taking damage.
- Avoid walls to navigate through the map effectively.

## Configuration

- The game map and level configurations are stored in JSON files in the assets/maps/ directory.
- Edit these files to change the map layout, player start position, and enemy positions.

## License

Distributed under the MIT License. See LICENSE for more information.
