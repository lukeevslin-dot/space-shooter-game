# Space Shooter Spec

## Goal
Build a 2D pixel-art space shooter in Phaser that is fun in short sessions, ships in three playable milestones, and uses true space-themed pixel art (not gothic placeholders).

## Requirements
- Platform: desktop web build (`index.html` + JS) that runs locally in browser.
- Engine: Phaser 3.
- Resolution: fixed internal render size (320x180 or 480x270), scaled with crisp nearest-neighbor pixels.
- Controls: keyboard (`A/D` or arrows to move, `Space` to shoot, `P` pause).
- Core loop: survive waves, destroy enemies, score points, avoid collisions/projectiles.
- Gameplay feedback: HP/lives UI, score UI, hit/death VFX, game-over + restart.
- Performance: stable 60 FPS on modern laptop browsers.

## Milestones (each playable)

### Milestone 1 - Playable Vertical Slice
Scope:
- One playable ship character with movement + shooting.
- One enemy type that moves and can be destroyed.
- Basic collisions, player damage, score counter.
- Loop: spawn enemies continuously until player dies.

Definition of done:
- You can start game, move, shoot, destroy enemies, lose all HP, and restart.

### Milestone 2 - Combat Depth
Scope:
- Add enemy projectiles and at least one additional enemy behavior.
- Add temporary power-up (fire-rate up or shield).
- Add wave progression and increasing difficulty curve.
- Add polish pass: hit flash, explosion effect, better UI readability.

Definition of done:
- Full session lasts multiple waves; difficulty ramps; power-up changes gameplay.

### Milestone 3 - Production-Ready MVP
Scope:
- Start screen, pause, game-over summary, high score persistence (localStorage).
- Audio hooks (SFX slots), balancing pass for HP, fire-rate, spawn rates.
- Optional boss wave or elite enemy at fixed intervals.
- Final art integration pass and cleanup for consistent style.

Definition of done:
- A first public-playable build with complete menu-to-game-over loop and saved high score.

## Pixel Art Assets To Use (True Space Art)

Notes:
- Primary pack: [Kenney Space Shooter Redux](https://kenney.nl/assets/space-shooter-redux)
- Direct zip: [SpaceShooterRedux.zip](https://opengameart.org/sites/default/files/SpaceShooterRedux.zip)
- License: [CC0](https://creativecommons.org/publicdomain/zero/1.0/)
- Optional backup pack: [CC0 Space Shooter Collection](https://opengameart.org/content/cc0-space-shooter)

### Planned Asset Categories
- Player ships (1 primary + 2 alternates).
- Enemy ships (small/medium variants for wave scaling).
- Projectile sprites (player laser + enemy shot).
- Explosion frames (small + medium).
- Background tiles/parallax stars.
- UI icons/numbers (score, HP/lives).

## Integration Status
- Engine choice set to Phaser 3.
- Art direction locked to true space pixel art.
- Shooter orientation locked to vertical.
- Asset pack downloaded and integrated into `game/assets/images/` with runtime filenames wired in `game/game.js`.
