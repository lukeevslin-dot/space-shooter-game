const GAME_W = 960;
const GAME_H = 540;

class MainScene extends Phaser.Scene {
  constructor() {
    super("main");
    this.speed = 260;
    this.fireCooldownMs = 180;
    this.lastFired = 0;
    this.score = 0;
    this.lives = 3;
    this.wave = 1;
    this.enemySpawnDelay = 900;
    this.enemyShootDelay = 1200;
    this.activePowerupUntil = 0;
    this.invulnerableUntil = 0;
    this.isStarted = false;
    this.isPaused = false;
    this.isGameOver = false;
    this.highScore = 0;
  }

  preload() {
    // Space-art integration slots. Drop files into these paths.
    this.load.image("bgStars", "assets/images/backgrounds/bg_stars.png");
    this.load.image("playerShip", "assets/images/player/player_ship.png");
    this.load.image("enemyShipA", "assets/images/enemies/enemy_ship_a.png");
    this.load.image("enemyShipB", "assets/images/enemies/enemy_ship_b.png");
    this.load.image("playerLaser", "assets/images/projectiles/player_laser.png");
    this.load.image("enemyLaser", "assets/images/projectiles/enemy_laser.png");
    this.load.image("lifeIcon", "assets/images/ui/life_icon.png");
    this.load.image("explosion00", "assets/images/fx/explosion_00.png");
    this.load.image("explosion01", "assets/images/fx/explosion_01.png");
    this.load.image("explosion02", "assets/images/fx/explosion_02.png");
    this.load.image("explosion03", "assets/images/fx/explosion_03.png");
    this.load.image("explosion04", "assets/images/fx/explosion_04.png");
    this.load.image("explosion05", "assets/images/fx/explosion_05.png");

    this.load.audio("sfxLaser", "assets/audio/sfx_laser1.ogg");
    this.load.audio("sfxHit", "assets/audio/sfx_twoTone.ogg");
    this.load.audio("sfxLose", "assets/audio/sfx_lose.ogg");
  }

  create() {
    this.resetRunState();
    this.cursors = this.input.keyboard.createCursorKeys();
    this.shootKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    this.startKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.restartKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    this.highScore = this.loadHighScore();

    this.createBackground();
    this.createHud();
    this.createPlayer();
    this.createGroups();
    this.createColliders();
    this.createTimers();
    this.createOverlays();
    this.createAudio();
    this.createArtStatus();
    this.setGameFlowStarted(false);

    this.add
      .text(8, GAME_H - 18, "Enter: Start  P: Pause  Space: Shoot", {
        fontFamily: "monospace",
        fontSize: 10,
        color: "#a9d6ff",
      })
      .setScrollFactor(0);
  }

  createArtStatus() {
    const usingLiveArt =
      this.textures.exists("playerShip") &&
      this.textures.exists("enemyShipA") &&
      this.textures.exists("bgStars");
    this.add
      .text(GAME_W - 120, GAME_H - 18, usingLiveArt ? "ART: LIVE" : "ART: FALLBACK", {
        fontFamily: "monospace",
        fontSize: 10,
        color: usingLiveArt ? "#7dffb3" : "#ff9c9c",
      })
      .setScrollFactor(0);
  }

  resetRunState() {
    this.speed = 260;
    this.fireCooldownMs = 180;
    this.lastFired = 0;
    this.score = 0;
    this.lives = 3;
    this.wave = 1;
    this.enemySpawnDelay = 900;
    this.enemyShootDelay = 1200;
    this.activePowerupUntil = 0;
    this.invulnerableUntil = 0;
    this.isStarted = false;
    this.isPaused = false;
    this.isGameOver = false;
  }

  createBackground() {
    if (this.textures.exists("bgStars")) {
      this.bg = this.add.tileSprite(0, 0, GAME_W, GAME_H, "bgStars").setOrigin(0, 0);
    } else {
      this.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, 0x050a16);
    }
  }

  createHud() {
    this.scoreText = this.add.text(8, 6, "Score: 0", { fontFamily: "monospace", fontSize: 12, color: "#ffffff" });
    this.livesText = this.add.text(GAME_W - 80, 6, "Lives: 3", { fontFamily: "monospace", fontSize: 12, color: "#ffffff" });
    this.waveText = this.add.text(GAME_W / 2 - 30, 6, "Wave: 1", { fontFamily: "monospace", fontSize: 12, color: "#ffe57a" });
    this.powerupText = this.add.text(8, 22, "", { fontFamily: "monospace", fontSize: 11, color: "#7dffb3" });
    this.highScoreText = this.add.text(GAME_W - 150, 22, `Best: ${this.highScore}`, {
      fontFamily: "monospace",
      fontSize: 11,
      color: "#9fd3ff",
    });
  }

  createOverlays() {
    this.overlayBg = this.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, 0x000000, 0.45).setVisible(true);
    this.overlayText = this.add
      .text(GAME_W / 2, GAME_H / 2 - 12, "SPACE SHOOTER\nPress Enter to Start", {
        fontFamily: "monospace",
        fontSize: 18,
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5)
      .setVisible(true);
    this.overlayHintText = this.add
      .text(GAME_W / 2, GAME_H / 2 + 38, "Arrows move  Space shoot  P pause", {
        fontFamily: "monospace",
        fontSize: 11,
        color: "#9fd3ff",
        align: "center",
      })
      .setOrigin(0.5)
      .setVisible(true);
  }

  createAudio() {
    this.sfx = {
      laser: this.sound.add("sfxLaser", { volume: 0.22 }),
      hit: this.sound.add("sfxHit", { volume: 0.2 }),
      lose: this.sound.add("sfxLose", { volume: 0.34 }),
    };
  }

  createPlayer() {
    const texture = this.textures.exists("playerShip") ? "playerShip" : null;
    if (texture) {
      this.player = this.physics.add.sprite(GAME_W / 2, GAME_H - 36, texture);
      this.player.setScale(0.75);
      this.player.setCollideWorldBounds(true);
    } else {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0x6cf2ff, 1);
      g.fillTriangle(8, 0, 16, 16, 0, 16);
      g.generateTexture("fallbackPlayer", 16, 16);
      g.destroy();
      this.player = this.physics.add.sprite(GAME_W / 2, GAME_H - 36, "fallbackPlayer");
      this.player.setCollideWorldBounds(true);
    }
  }

  createGroups() {
    this.playerShots = this.physics.add.group();
    this.enemyShots = this.physics.add.group();
    this.enemies = this.physics.add.group();
    this.powerups = this.physics.add.group();
  }

  createColliders() {
    this.physics.add.overlap(this.playerShots, this.enemies, (shot, enemy) => {
      shot.destroy();
      this.spawnExplosion(enemy.x, enemy.y);
      this.playSfx("hit");
      enemy.destroy();
      this.score += 10;
      this.scoreText.setText(`Score: ${this.score}`);
      this.trySpawnPowerup(enemy.x, enemy.y);
      this.updateWaveFromScore();
    });

    this.physics.add.overlap(this.player, this.enemies, (_player, enemy) => {
      this.spawnExplosion(enemy.x, enemy.y);
      enemy.destroy();
      this.damagePlayer();
    });

    this.physics.add.overlap(this.player, this.enemyShots, (_player, shot) => {
      shot.destroy();
      this.damagePlayer();
    });

    this.physics.add.overlap(this.player, this.powerups, (_player, powerup) => {
      powerup.destroy();
      this.fireCooldownMs = 95;
      this.activePowerupUntil = this.time.now + 7000;
      this.powerupText.setText("Rapid Fire: ON");
      this.playSfx("hit");
    });
  }

  createTimers() {
    this.spawnTimer = this.time.addEvent({
      delay: this.enemySpawnDelay,
      loop: true,
      callback: () => this.spawnEnemy(),
    });

    this.enemyShootTimer = this.time.addEvent({
      delay: this.enemyShootDelay,
      loop: true,
      callback: () => this.enemyShoot(),
    });
  }

  setGameFlowStarted(started) {
    this.isStarted = started;
    this.spawnTimer.paused = !started;
    this.enemyShootTimer.paused = !started;
    if (!started) this.player.setVelocityX(0);
  }

  spawnEnemy() {
    if (!this.isStarted || this.isPaused || this.isGameOver) return;
    const x = Phaser.Math.Between(28, GAME_W - 28);
    const hasEnemyB = this.textures.exists("enemyShipB");
    const useB = hasEnemyB && Phaser.Math.Between(0, 99) < 40;
    const useRealEnemy = this.textures.exists("enemyShipA");
    const key = useB ? "enemyShipB" : useRealEnemy ? "enemyShipA" : "fallbackEnemy";

    if (!useRealEnemy && !this.textures.exists("fallbackEnemy")) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0xff5f7a, 1);
      g.fillTriangle(8, 16, 0, 0, 16, 0);
      g.generateTexture("fallbackEnemy", 16, 16);
      g.destroy();
    }

    const enemy = this.enemies.create(x, -12, key);
    enemy.setScale(0.72);
    enemy.enemyType = useB ? "zigzag" : "straight";
    enemy.spawnTime = this.time.now;
    enemy.baseX = x;
    enemy.setVelocityY(50 + this.wave * 5);
  }

  enemyShoot() {
    if (!this.isStarted || this.isPaused || this.isGameOver) return;
    const alive = this.enemies.getChildren().filter((e) => e && e.active);
    if (!alive.length) return;
    const shooter = Phaser.Utils.Array.GetRandom(alive);

    const useRealLaser = this.textures.exists("enemyLaser");
    const key = useRealLaser ? "enemyLaser" : "fallbackEnemyLaser";
    if (!useRealLaser && !this.textures.exists("fallbackEnemyLaser")) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0xff8f8f, 1);
      g.fillRect(0, 0, 2, 8);
      g.generateTexture("fallbackEnemyLaser", 2, 8);
      g.destroy();
    }
    const shot = this.enemyShots.create(shooter.x, shooter.y + 10, key);
    shot.setVelocityY(90 + this.wave * 5);
  }

  trySpawnPowerup(x, y) {
    if (Phaser.Math.Between(0, 99) > 12) return;
    const key = this.textures.exists("lifeIcon") ? "lifeIcon" : "fallbackPowerup";
    if (!this.textures.exists("lifeIcon") && !this.textures.exists("fallbackPowerup")) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0x7dffb3, 1);
      g.fillCircle(6, 6, 6);
      g.generateTexture("fallbackPowerup", 12, 12);
      g.destroy();
    }
    const powerup = this.powerups.create(x, y, key);
    powerup.setVelocityY(55);
  }

  updateWaveFromScore() {
    const nextWave = Math.min(9, 1 + Math.floor(this.score / 120));
    if (nextWave === this.wave) return;
    this.wave = nextWave;
    this.waveText.setText(`Wave: ${this.wave}`);
    this.enemySpawnDelay = Math.max(680, 1140 - this.wave * 40);
    this.enemyShootDelay = Math.max(820, 1450 - this.wave * 50);
    this.spawnTimer.reset({ delay: this.enemySpawnDelay, loop: true, callback: () => this.spawnEnemy() });
    this.enemyShootTimer.reset({ delay: this.enemyShootDelay, loop: true, callback: () => this.enemyShoot() });
  }

  damagePlayer() {
    if (this.isGameOver) return;
    if (this.time.now < this.invulnerableUntil) return;
    this.invulnerableUntil = this.time.now + 700;
    this.lives -= 1;
    this.livesText.setText(`Lives: ${this.lives}`);
    this.playSfx("hit");
    this.cameras.main.flash(80, 255, 70, 70);
    if (this.lives <= 0) {
      this.endGame();
    }
  }

  endGame() {
    this.isGameOver = true;
    this.spawnTimer.paused = true;
    this.enemyShootTimer.paused = true;
    this.player.setVelocityX(0);
    this.physics.world.pause();
    this.playSfx("lose");
    this.saveHighScore(this.score);
    this.highScore = this.loadHighScore();
    this.highScoreText.setText(`Best: ${this.highScore}`);
    this.overlayBg.setVisible(true);
    this.overlayText.setText(`Game Over\nScore: ${this.score}\nBest: ${this.highScore}`);
    this.overlayText.setVisible(true);
    this.overlayHintText.setText("Press R to restart");
    this.overlayHintText.setVisible(true);
  }

  spawnExplosion(x, y) {
    const frames = ["explosion00", "explosion01", "explosion02", "explosion03", "explosion04", "explosion05"];
    const hasExplosionFrames = frames.every((k) => this.textures.exists(k));
    if (!hasExplosionFrames) return;
    const boom = this.add.image(x, y, frames[0]).setDepth(5);
    let i = 0;
    this.time.addEvent({
      delay: 45,
      repeat: frames.length - 1,
      callback: () => {
        if (!boom.active) return;
        boom.setTexture(frames[i]);
        i += 1;
        if (i >= frames.length) boom.destroy();
      },
    });
  }

  playSfx(key) {
    if (!this.sfx || !this.sfx[key]) return;
    this.sfx[key].play();
  }

  togglePause() {
    if (!this.isStarted || this.isGameOver) return;
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      this.spawnTimer.paused = true;
      this.enemyShootTimer.paused = true;
      this.physics.world.pause();
      this.overlayBg.setVisible(true);
      this.overlayText.setText("Paused");
      this.overlayText.setVisible(true);
      this.overlayHintText.setText("Press P to resume");
      this.overlayHintText.setVisible(true);
    } else {
      this.spawnTimer.paused = false;
      this.enemyShootTimer.paused = false;
      this.physics.world.resume();
      this.overlayBg.setVisible(false);
      this.overlayText.setVisible(false);
      this.overlayHintText.setVisible(false);
    }
  }

  loadHighScore() {
    try {
      const raw = window.localStorage.getItem("spaceShooterHighScore");
      const value = Number(raw || 0);
      return Number.isFinite(value) ? value : 0;
    } catch (_err) {
      return 0;
    }
  }

  saveHighScore(score) {
    try {
      const best = this.loadHighScore();
      if (score > best) window.localStorage.setItem("spaceShooterHighScore", String(score));
    } catch (_err) {
      // Ignore storage errors in restricted browser modes.
    }
  }

  shoot(timeNow) {
    if (timeNow - this.lastFired < this.fireCooldownMs) return;
    this.lastFired = timeNow;

    const useRealLaser = this.textures.exists("playerLaser");
    const key = useRealLaser ? "playerLaser" : "fallbackLaser";

    if (!useRealLaser && !this.textures.exists("fallbackLaser")) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0xa0f5ff, 1);
      g.fillRect(0, 0, 2, 8);
      g.generateTexture("fallbackLaser", 2, 8);
      g.destroy();
    }

    const shot = this.playerShots.create(this.player.x, this.player.y - 12, key);
    shot.setVelocityY(-300);
    this.playSfx("laser");
  }

  update(time) {
    if (this.bg) this.bg.tilePositionY -= 0.4;

    if (!this.isStarted && Phaser.Input.Keyboard.JustDown(this.startKey)) {
      this.overlayBg.setVisible(false);
      this.overlayText.setVisible(false);
      this.overlayHintText.setVisible(false);
      this.setGameFlowStarted(true);
    }
    if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
      this.togglePause();
    }
    if (this.isGameOver && Phaser.Input.Keyboard.JustDown(this.restartKey)) {
      this.scene.restart();
      return;
    }
    if (!this.isStarted || this.isPaused || this.isGameOver) return;

    const left = this.cursors.left.isDown;
    const right = this.cursors.right.isDown;
    const up = this.cursors.up.isDown;
    const down = this.cursors.down.isDown;
    const dirX = (right ? 1 : 0) - (left ? 1 : 0);
    const dirY = (down ? 1 : 0) - (up ? 1 : 0);
    this.player.setVelocityX(dirX * this.speed);
    this.player.setVelocityY(dirY * this.speed);

    if (Phaser.Input.Keyboard.JustDown(this.shootKey) || this.shootKey.isDown) {
      this.shoot(time);
    }

    if (this.activePowerupUntil && time > this.activePowerupUntil) {
      this.activePowerupUntil = 0;
      this.fireCooldownMs = 180;
      this.powerupText.setText("");
    }

    this.playerShots.children.each((shot) => {
      if (shot && shot.y < -20) shot.destroy();
    });
    this.enemyShots.children.each((shot) => {
      if (shot && shot.y > GAME_H + 20) shot.destroy();
    });
    this.enemies.children.each((enemy) => {
      if (enemy && enemy.enemyType === "zigzag") {
        const age = (time - enemy.spawnTime) * 0.003;
        enemy.x = enemy.baseX + Math.sin(age * 2.2) * 30;
      }
      if (enemy && enemy.y > GAME_H + 20) enemy.destroy();
    });
    this.powerups.children.each((item) => {
      if (item && item.y > GAME_H + 20) item.destroy();
    });
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game-root",
  width: GAME_W,
  height: GAME_H,
  backgroundColor: "#050a16",
  pixelArt: true,
  physics: { default: "arcade", arcade: { debug: false } },
  scene: [MainScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
});
