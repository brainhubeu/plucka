import kaboom, { GameObj, SpriteCompOpt, Vec2 } from 'kaboom';
import { randomFloat, randomInt } from '../shared/utility/random';

type GameOptions = {
  width: number;
  height: number;
  lungsDeteriorationLevel: number;
  onWin: () => void;
  onLose: () => void;
};
export const runGame = (canvasSelector: string, { lungsDeteriorationLevel, width, height, onWin, onLose }: GameOptions) => {
  const element = document.querySelector<HTMLCanvasElement>(canvasSelector);
  if (!element) {
    console.error('Element #game not found');
    return () => {};
  }
  const k = kaboom({
    background: [58, 68, 102],
    width,
    height,
    font: 'sans-serif',
    canvas: element,
  });

  const smog = 'smog';
  const objs: [name: string, options?: SpriteCompOpt][] = [
    ['exhaust', { width: 150 }],
    ['carbon'],
  ];
  const ammo = [
    // 'ammo_autumn',
    // 'ammo_rain',
    // 'ammo_winter',
    // 'ammo_spring',
    // 'ammo_summer',
    'ammo_leaf',
  ];
  // const lungs = [
  //   'lungs_1',
  //   'lungs_2',
  //   'lungs_3',
  //   'lungs_4',
  //   'lungs_5',
  // ];
  const lungs = 'lungs';
  const powerUp = 'powerUp';
  const healthBarBackground = 'boss_health_bar'
  const playerHealthIcon = 'player_health_icon';
  const playerHealthBar = 'player_health_bar';
  const grass = 'grass';

  k.loadSprite(smog, `/sprites/${smog}.png`);
  for (const obj of objs) {
    k.loadSprite(obj[0], `/sprites/${obj[0]}.png`)
  }
  for (const obj of ammo) {
    k.loadSprite(obj, `/sprites/${obj}.png`)
  }
  k.loadSprite(lungs, `/sprites/${lungs}.png`, {
    sliceX: 5,
    anims: {
      "5": 0,
      "4": 1,
      "3": 2,
      "2": 3,
      "1": 4,
    },
  });
  k.loadSprite(powerUp, `sprites/${powerUp}.png`);
  k.loadSprite(healthBarBackground, `sprites/${healthBarBackground}.png`);
  k.loadSprite(playerHealthIcon, `sprites/${playerHealthIcon}.png`);
  k.loadSprite(playerHealthBar, `sprites/${playerHealthBar}.png`);
  k.loadSprite(grass, `sprites/${grass}.png`);

  k.loadBean();
  // k.loadSound('hit', '/examples/sounds/hit.mp3')
  // k.loadSound('shoot', '/examples/sounds/shoot.mp3')
  // k.loadSound('explode', '/examples/sounds/explode.mp3')
  // k.loadSound('OtherworldlyFoe', '/examples/sounds/OtherworldlyFoe.mp3')

  k.scene('battle', () => {
    const BULLET_SPEED = 1200
    const TRASH_SPEED = 120
    const BOSS_SPEED = 48
    const PLAYER_SPEED = 480
    const BOSS_HEALTH = 1000
    const OBJ_HEALTH = 4
    const AUTO_FIRE_INTERVAL = 300
    const AUTO_FIRE_SPEED_INTERVAL_BONUS = 25
    const AUTO_FIRE_MIN_INTERVAL = 50;
    const NON_AUTO_FIRE_INTERVAL = 600

    let powerUpAutoFire = false;
    let powerUpSpread = false;
    let powerUpSpeed = 0;

    // const music = k.play('OtherworldlyFoe')

    k.volume(0.5)

    function grow(rate: number) {
      return {
        update(this: GameObj) {
          const n = rate * k.dt()
          this.scale.x += n
          this.scale.y += n
        },
      }
    }

    function pulse(frequency: number, rate: number) {
      return {
        update(this: GameObj) {
          const n = Math.sin(k.time() * frequency) * rate * k.dt()
          this.scale.x += n
          this.scale.y += n
        },
      }
    }

    function late(t: number) {
      let timer = 0
      return {
        add(this: any) {
          this.hidden = true
        },
        update(this: any) {
          timer += k.dt()
          if (timer >= t) {
            this.hidden = false
          }
        },
      }
    }

    // --------- player and their interactions -----------
    const player = k.add([
      k.sprite(lungs,  { width: 150, height: 150 }),
      k.area(),
      k.pos(k.width() / 2, k.height() - 120),
      k.anchor('center'),
      k.health(6 - lungsDeteriorationLevel),
      k.scale(1, 1),
      pulse(3, 0.1),
      k.z(50),
    ]);

    k.onKeyDown('left', () => {
      player.move(-PLAYER_SPEED, 0)
      if (player.pos.x < 0) {
        player.pos.x = k.width()
      }
    })

    k.onKeyDown('right', () => {
      player.move(PLAYER_SPEED, 0)
      if (player.pos.x > k.width()) {
        player.pos.x = 0
      }
    })

    function applyPowerUp() {
      if (powerUpSpeed) {
        powerUpSpeed++;
        return;
      }
      if (powerUpSpread) {
        powerUpSpeed++;
        k.add([
          k.text('MACHINE-GUN', { size: 60 }),
          k.pos(k.width() / 2, k.height() / 2),
          k.anchor('center'),
          k.lifespan(1),
          k.fixed(),
          k.z(60),
        ])
        return;
      }
      if (powerUpAutoFire) {
        powerUpSpread = true;
        k.add([
          k.text('SPREAD', { size: 60 }),
          k.pos(k.width() / 2, k.height() / 2),
          k.anchor('center'),
          k.lifespan(1),
          k.fixed(),
          k.z(60),
        ])
        return;
      }
      powerUpAutoFire = true;
      k.add([
        k.text('AUTO-FIRE', { size: 60 }),
        k.pos(k.width() / 2, k.height() / 2),
        k.anchor('center'),
        k.lifespan(1),
        k.fixed(),
        k.z(60),
      ])
      return;
    }

    k.onKeyPress('p', () => {
      applyPowerUp();
    });

    player.onCollide('powerUp', (e) => {
      player.heal();
      k.destroy(e);
      applyPowerUp();
    });

    player.onCollide('enemy', (e) => {
      player.hurt(1);
      k.shake(5);
      k.destroy(e);
    });
    player.on("hurt", () => {
      const hp = player.hp();
      if (hp) {
        player.play(`${Math.min(5, hp)}`);
      }

      powerUpAutoFire = false;
      powerUpSpread = false;
      powerUpSpeed = 0;
    })
    player.on('heal', () => {
      const hp = player.hp();
      if (hp) {
        player.play(`${Math.min(5, hp)}`);
      }
    });
    player.on("death", () => {
      k.destroy(player)
      k.shake(120)
      addExplode(k.center(), 12, 120, 30);
      k.wait(1, () => {
        k.go('lose', { boss: smog })
      })
    })

    k.add([
      k.sprite(playerHealthIcon, { width: 60, height: 60 }),
      k.pos(15, k.height() - 100),
      k.anchor('left'),
      k.z(60),
    ]);

    const playerHealthBars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(index => {
      return k.add([
        k.sprite(playerHealthBar, { width: 20, height: 60 }),
        k.pos(15 + 50 + 20 * index, k.height() - 103),
        k.anchor('left'),
        k.opacity(1),
        k.z(60),
      ]);
    });
    k.onUpdate(() => {
      playerHealthBars.forEach((healthBar, index) => {
        healthBar.opacity = index < player.hp() ? 1 : 0;
      })
    });

    function addExplode(p: Vec2, n: number, rad: number, size: number) {
      for (let i = 0; i < n; i++) {
        k.wait(k.rand(n * 0.1), () => {
          for (let i = 0; i < 2; i++) {
            k.add([
              k.pos(p.add(k.rand(k.vec2(-rad), k.vec2(rad)))),
              k.rect(4, 4),
              k.scale(1 * size, 1 * size),
              k.lifespan(0.1),
              grow(k.rand(48, 72) * size),
              k.anchor('center'),
              k.z(55),
            ])
          }
        })
      }
    }

    function spawnBullet(p: Vec2) {
      k.add([
        k.sprite(k.choose(ammo)),
        k.area(),
        k.pos(p.add(new k.Vec2(0, -60))),
        k.anchor('center'),
        k.move(powerUpSpread ? k.Vec2.fromAngle(270 + randomInt(-15, 15)) : k.UP, BULLET_SPEED * randomFloat(0.8, 1.2)),
        k.offscreen({ destroy: true }),
        k.z(25),
        'bullet',
      ]);
    }

    let lastSpawned = 0;
    let spacePressed = false;
    k.onUpdate(() => {
      const interval = (() => {
        if (powerUpSpeed) {
          return Math.max(AUTO_FIRE_MIN_INTERVAL, AUTO_FIRE_INTERVAL - AUTO_FIRE_SPEED_INTERVAL_BONUS * powerUpSpeed);
        }
        if (powerUpAutoFire) {
          return AUTO_FIRE_INTERVAL;
        }
        return NON_AUTO_FIRE_INTERVAL;
      })();
      if (!spacePressed || (Date.now() - lastSpawned) < interval) {
        return;
      }
      lastSpawned = Date.now();
      spawnBullet(player.pos)
    });
    k.onKeyDown('space', () => {
      spacePressed = true;
    });
    k.onKeyRelease('space', () => {
      spacePressed = false;
      lastSpawned = 0;
    });

    function spawnTrash() {
      const [name, options] = k.choose(objs);
      k.add([
        k.sprite(name, options ? options : {}),
        k.area(),
        k.pos(k.rand(0, k.width()), 0),
        k.health(OBJ_HEALTH),
        k.anchor('bot'),
        k.z(15),
        'trash',
        'enemy',
        { speed: k.rand(TRASH_SPEED * 0.5, TRASH_SPEED * 1.5) },
      ])
      k.wait(0.3, spawnTrash)
    }
    function spawnPowerUp() {
      k.add([
        k.sprite(powerUp),
        k.area(),
        k.pos(k.rand(0, k.width()), 0),
        k.anchor('bot'),
        k.z(15),
        'trash',
        'powerUp',
        { speed: k.rand(TRASH_SPEED * 0.5, TRASH_SPEED * 1.5) },
      ])
      k.wait(5, spawnPowerUp)
    }

    const boss = k.add([
      k.sprite(smog),
      k.area(),
      k.pos(k.width() / 2, 80),
      k.health(BOSS_HEALTH),
      k.scale(3),
      k.anchor('top'),
      k.z(50),
      'enemy',
      'boss',
      {
        dir: 1,
      },
    ])

    k.on('death', 'enemy', (e) => {
      k.destroy(e)
      k.shake(2)
      k.addKaboom(e.pos)
    })

    k.on('hurt', 'enemy', (e) => {
      k.shake(1)
    })

    k.onCollide('bullet', 'enemy', (b, e) => {
      k.destroy(b)
      e.hurt(1)
      addExplode(b.pos, 1, 24, 1)
    })

    k.onUpdate('trash', (t) => {
      t.move(0, t.speed * (1))
      if (t.pos.y - t.height > k.height()) {
        k.destroy(t)
      }
    })

    boss.onUpdate(() => {
      boss.move(BOSS_SPEED * boss.dir * 1, 0)
      if (boss.dir === 1 && boss.pos.x >= k.width() - 20) {
        boss.dir = -1
      }
      if (boss.dir === -1 && boss.pos.x <= 20) {
        boss.dir = 1
      }
    })

    boss.onHurt(() => {
      healthBarObject.set(boss.hp())
    })

    boss.onDeath(() => {
      // music.stop()
      k.go('win', {
        boss: smog,
      })
    })

    const healthBarBackgroundObject = k.add([
      k.sprite(healthBarBackground),
      k.anchor('center'),
      k.pos(k.width() / 2, 50),
      k.scale((width - 100) / 1300, 0.5),
      k.fixed(),
      k.z(60),
    ])
    const healthBarObject = k.add([
      k.rect(width - 100 - 30, 24),
      k.pos(50 + 15, 50),
      k.anchor('left'),
      k.color(107, 201, 108),
      k.fixed(),
      k.z(60),
      {
        max: BOSS_HEALTH,
        set(this: GameObj, hp: number) {
          this.width = (width - 100 - 30) * hp / this.max
          this.flash = true
        },
        flash: false,
      },
    ]);

    healthBarObject.onUpdate(() => {
      if (healthBarObject.flash) {
        healthBarObject.color = k.rgb(255, 255, 255)
        healthBarObject.flash = false
      } else {
        healthBarObject.color = k.rgb(127, 255, 127)
      }
    })

    k.add([
      k.sprite('grass', { width: k.width(), height: 150 }),
      k.anchor('center'),
      k.pos(k.width() / 2, k.height() - 75),
      k.z(10),
    ])

    spawnTrash();
    spawnPowerUp();

  })

  k.scene('win', ({ boss }) => {
    k.add([
      k.sprite(boss),
      k.color(255, 0, 0),
      k.anchor('center'),
      k.scale(8),
      k.pos(k.width() / 2, k.height() / 2),
    ])

    onWin();
  })

  k.scene('lose', ({ boss }) => {
    k.add([
      k.sprite(boss),
      k.anchor('center'),
      k.scale(8),
      k.pos(k.width() / 2, k.height() / 2),
    ])

    onLose();
  });

  k.go('battle');

  return () => k.quit();
};
