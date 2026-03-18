export type FallingItemType =
  | "normal_rsn"
  | "golden_rsn"
  | "multiplier"
  | "streak"
  | "red_crash_orb"
  | "heavy_drop"
  | "glitch_block";

export type FallingItem = {
  id: string;
  type: FallingItemType;
  x: number;
  y: number;
  size: number;
  speed: number;
  rotation: number;
  rotationSpeed: number;
};

export type Player = {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
};

export type GameState = {
  score: number;
  lives: number;
  level: number;
  elapsedSeconds: number;
  comboCount: number;
  comboMultiplier: number;
  multiplierActiveUntil: number | null;
  isGameOver: boolean;
};

export const GAME_WIDTH = 900;
export const GAME_HEIGHT = 560;

export const INITIAL_PLAYER: Player = {
  x: GAME_WIDTH / 2 - 80,
  y: GAME_HEIGHT - 72,
  width: 160,
  height: 54,
  speed: 10,
};

export const INITIAL_GAME_STATE: GameState = {
  score: 0,
  lives: 3,
  level: 1,
  elapsedSeconds: 0,
  comboCount: 0,
  comboMultiplier: 1,
  multiplierActiveUntil: null,
  isGameOver: false,
};

export function getLevelFromElapsed(elapsedSeconds: number): number {
  return Math.floor(elapsedSeconds / 30) + 1;
}

export function getSpawnInterval(level: number): number {
  return Math.max(220, 880 - (level - 1) * 95);
}

export function getDropSpeed(level: number): number {
  return 2.8 + (level - 1) * 0.8;
}

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randomType(level: number): FallingItemType {
  const badWeight = Math.min(0.18 + level * 0.03, 0.42);
  const goldenWeight = 0.08;
  const multiplierWeight = 0.05;
  const streakWeight = 0.08;

  const roll = Math.random();

  if (roll < badWeight / 3) return "red_crash_orb";
  if (roll < (badWeight * 2) / 3) return "heavy_drop";
  if (roll < badWeight) return "glitch_block";
  if (roll < badWeight + goldenWeight) return "golden_rsn";
  if (roll < badWeight + goldenWeight + multiplierWeight) return "multiplier";
  if (roll < badWeight + goldenWeight + multiplierWeight + streakWeight) return "streak";
  return "normal_rsn";
}

export function createFallingItem(level: number): FallingItem {
  const type = randomType(level);

  let size = 30;
  let speed = getDropSpeed(level);

  if (type === "golden_rsn") {
    size = 34;
    speed += 0.35;
  }

  if (type === "multiplier" || type === "streak") {
    size = 28;
    speed += 0.2;
  }

  if (type === "red_crash_orb" || type === "glitch_block") {
    size = 32;
    speed += 0.45;
  }

  if (type === "heavy_drop") {
    size = 40;
    speed += 0.9;
  }

  return {
    id: crypto.randomUUID(),
    type,
    x: randomBetween(30, GAME_WIDTH - 60),
    y: -50,
    size,
    speed,
    rotation: randomBetween(0, Math.PI * 2),
    rotationSpeed: randomBetween(-0.035, 0.035),
  };
}

export function movePlayer(
  player: Player,
  direction: "left" | "right" | null
): Player {
  if (!direction) return player;

  let nextX = player.x;

  if (direction === "left") nextX -= player.speed;
  if (direction === "right") nextX += player.speed;

  nextX = Math.max(0, Math.min(GAME_WIDTH - player.width, nextX));

  return { ...player, x: nextX };
}

export function checkCollision(item: FallingItem, player: Player): boolean {
  const catchZoneX = player.x + 18;
  const catchZoneY = player.y + 8;
  const catchZoneWidth = player.width - 36;
  const catchZoneHeight = player.height - 14;

  return (
    item.x < catchZoneX + catchZoneWidth &&
    item.x + item.size > catchZoneX &&
    item.y < catchZoneY + catchZoneHeight &&
    item.y + item.size > catchZoneY
  );
}

export function getComboMultiplier(comboCount: number): number {
  if (comboCount >= 10) return 2;
  if (comboCount >= 6) return 1.5;
  if (comboCount >= 3) return 1.2;
  return 1;
}

export function applyCatchEffect(
  itemType: FallingItemType,
  state: GameState,
  nowMs: number
): GameState {
  let score = state.score;
  let lives = state.lives;
  let comboCount = state.comboCount;
  let multiplierActiveUntil = state.multiplierActiveUntil;

  const activeMultiplier =
    multiplierActiveUntil && multiplierActiveUntil > nowMs ? 2 : 1;

  if (itemType === "normal_rsn") {
    comboCount += 1;
    score += Math.round(5 * activeMultiplier * getComboMultiplier(comboCount));
  }

  if (itemType === "golden_rsn") {
    comboCount += 1;
    score += Math.round(20 * activeMultiplier * getComboMultiplier(comboCount));
  }

  if (itemType === "multiplier") {
    comboCount += 1;
    multiplierActiveUntil = nowMs + 5000;
    score += Math.round(25 * activeMultiplier);
  }

  if (itemType === "streak") {
    comboCount += 2;
    score += Math.round(40 * activeMultiplier * getComboMultiplier(comboCount));
  }

  if (itemType === "red_crash_orb") {
    comboCount = 0;
    score = Math.max(0, score - 120);
    lives -= 1;
  }

  if (itemType === "heavy_drop") {
    comboCount = 0;
    score = Math.max(0, score - 80);
    lives -= 1;
  }

  if (itemType === "glitch_block") {
    comboCount = 0;
    score = Math.max(0, score - 100);
    lives -= 1;
  }

  const comboMultiplier = getComboMultiplier(comboCount);

  return {
    ...state,
    score,
    lives,
    comboCount,
    comboMultiplier,
    multiplierActiveUntil,
    isGameOver: lives <= 0,
  };
}

export function isBadItem(type: FallingItemType): boolean {
  return (
    type === "red_crash_orb" ||
    type === "heavy_drop" ||
    type === "glitch_block"
  );
}