# Phaser Asset Integration Checklist

## Source Pack Links
- [Kenney Space Shooter Redux](https://kenney.nl/assets/space-shooter-redux)
- [Direct zip mirror](https://opengameart.org/sites/default/files/SpaceShooterRedux.zip)
- [License (CC0)](https://creativecommons.org/publicdomain/zero/1.0/)

## Target Local Structure
Create this local structure under project root when importing files:
- `game/assets/images/player/`
- `game/assets/images/enemies/`
- `game/assets/images/projectiles/`
- `game/assets/images/fx/`
- `game/assets/images/backgrounds/`
- `game/assets/images/ui/`

## Required Integration Files
Put one selected file in each slot:
- `game/assets/images/player/player_ship.png`
- `game/assets/images/enemies/enemy_ship_a.png`
- `game/assets/images/enemies/enemy_ship_b.png`
- `game/assets/images/projectiles/player_laser.png`
- `game/assets/images/projectiles/enemy_laser.png`
- `game/assets/images/fx/explosion_00.png` ... `explosion_05.png`
- `game/assets/images/backgrounds/bg_stars.png`
- `game/assets/images/ui/life_icon.png`

## Phaser Preload Mapping
Use these keys in `preload()`:
- `playerShip` -> `assets/images/player/player_ship.png`
- `enemyShipA` -> `assets/images/enemies/enemy_ship_a.png`
- `enemyShipB` -> `assets/images/enemies/enemy_ship_b.png`
- `playerLaser` -> `assets/images/projectiles/player_laser.png`
- `enemyLaser` -> `assets/images/projectiles/enemy_laser.png`
- `bgStars` -> `assets/images/backgrounds/bg_stars.png`
- `lifeIcon` -> `assets/images/ui/life_icon.png`
- `explosion` (spritesheet) -> `assets/images/fx/explosion_strip.png` (frame config once exported)

## Playable Milestone Integration Mapping

### Milestone 1
- Player ship, enemy ship A, player laser, one explosion set, one background.
- Result: complete playable shoot-and-survive loop.

### Milestone 2
- Add enemy ship B, enemy laser, power-up icon(s), extra explosion variant.
- Result: multi-wave combat with readable visual variety.

### Milestone 3
- Add polished UI icon set and alternate background(s).
- Result: presentation-ready MVP with full visual consistency.

## Open Questions
- Preferred orientation is set to vertical shooter (`1942` style).

## Integration Completed
- Downloaded and unpacked `SpaceShooterRedux.zip` into `game/assets/_downloads/SpaceShooterRedux/`.
- Mapped and copied live assets into the required runtime filenames:
  - `player_ship.png` <- `playerShip2_blue.png`
  - `enemy_ship_a.png` <- `enemyRed1.png`
  - `enemy_ship_b.png` <- `enemyBlue2.png`
  - `player_laser.png` <- `laserBlue01.png`
  - `enemy_laser.png` <- `laserRed02.png`
  - `bg_stars.png` <- `Backgrounds/darkPurple.png`
  - `life_icon.png` <- `playerLife1_blue.png`
  - `explosion_00.png` ... `explosion_05.png` <- `fire00.png` ... `fire05.png`

## Run Command
- Start local server and open browser:
  - `"/Users/lukeevslin/Downloads/Legacy Collection/run-game.sh"`
- Optional custom port:
  - `"/Users/lukeevslin/Downloads/Legacy Collection/run-game.sh" 8090`
