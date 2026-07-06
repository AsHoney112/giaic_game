const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 480;
const TILE_SIZE = 32;
const GRAVITY = 0.6;
const MAX_FALL_SPEED = 12;
const FRICTION = 0.8;
const PLAYER_ACCELERATION = 0.5;
const PLAYER_MAX_SPEED = 5;
const PLAYER_RUN_SPEED = 8;
const PLAYER_JUMP_FORCE = -10;
const PLAYER_DOUBLE_JUMP_FORCE = -9;
const PLAYER_WALL_JUMP_X = 7;
const PLAYER_WALL_JUMP_Y = -8;
const PLAYER_DASH_SPEED = 14;
const PLAYER_DASH_DURATION = 12;
const PLAYER_SWIM_SPEED = 3;
const PLAYER_CLIMB_SPEED = 3;
const INVINCIBILITY_DURATION = 90;
const STOMP_BOUNCE = -8;
const MAX_LIVES = 5;
const START_LIVES = 3;
const MAX_HEALTH = 5;
const COIN_VALUE = 100;
const GEM_VALUE = 500;
const WORLD_COUNT = 3;
const LEVEL_COUNT = 3;
const checkpointIds = new WeakMap();
let checkpointCounter = 0;
function nextCheckpointId() { return ++checkpointCounter; }

const TILE = {
  AIR: 0,
  SOLID: 1,
  BRICK: 2,
  QUESTION: 3,
  SPIKE: 4,
  WATER: 5,
  LAVA: 6,
  LADDER: 7,
  COIN: 8,
  GEM: 9,
  CHECKPOINT: 10,
  EXIT: 11,
  PLATFORM_MOVE_X: 12,
  PLATFORM_MOVE_Y: 13,
  PLATFORM_FALL: 14,
  PLATFORM_SWING: 15,
  BREAKABLE: 16,
  ICE: 17,
  SAND: 18,
  SNOW: 19,
  SECRET: 20,
  ROPE_BRIDGE: 21,
  ELEVATOR: 22,
  BOUNCE: 23,
  CONVEYOR_LEFT: 24,
  CONVEYOR_RIGHT: 25
};

const ENEMY = {
  WALKER: 'walker',
  RUNNER: 'runner',
  BAT: 'bat',
  BEE: 'bee',
  TURTLE: 'turtle',
  SLIME: 'slime',
  FIRE_SPIRIT: 'fireSpirit',
  ARCHER_GOBLIN: 'archerGoblin',
  GIANT_CRAB: 'giantCrab',
  ROLLING_ROCK: 'rollingRock',
  GHOST: 'ghost',
  PLANT_MONSTER: 'plantMonster',
  SPIKE_BEAST: 'spikeBeast',
  MINI_BOSS: 'miniBoss',
  FINAL_BOSS: 'finalBoss'
};

const POWERUP = {
  COIN: 'coin',
  GEM: 'gem',
  HEART: 'heart',
  SHIELD: 'shield',
  SPEED_BOOTS: 'speedBoots',
  DOUBLE_DAMAGE: 'doubleDamage',
  INVINCIBILITY: 'invincibility',
  EXTRA_LIFE: 'extraLife',
  KEY: 'key',
  TREASURE_CHEST: 'treasureChest'
};

const DIR = {
  NONE: 0,
  LEFT: -1,
  RIGHT: 1,
  UP: -1,
  DOWN: 1
};
