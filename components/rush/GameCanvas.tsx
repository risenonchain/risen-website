"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  applyCatchEffect,
  checkCollision,
  createFallingItem,
  FallingItem,
  FallingItemType,
  GAME_HEIGHT,
  GAME_WIDTH,
  getLevelFromElapsed,
  getSpawnInterval,
  INITIAL_GAME_STATE,
  INITIAL_PLAYER,
  isBadItem,
  movePlayer,
  Player,
} from "@/lib/rushEngine";

type FinishData = {
  finalScore: number;
  durationSeconds: number;
  levelReached: number;
  livesRemaining: number;
};

type Props = {
  isPlaying: boolean;
  onGameOver: (data: FinishData) => void;
};

type HitEffect = {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  createdAt: number;
};

export default function GameCanvas({ isPlaying, onGameOver }: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const itemsRef = useRef<FallingItem[]>([]);
  const hitEffectsRef = useRef<HitEffect[]>([]);
  const lastSpawnTimeRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const lastTimerSecondRef = useRef<number>(0);

  const playerRef = useRef<Player>({ ...INITIAL_PLAYER });
  const stateRef = useRef({ ...INITIAL_GAME_STATE });

  const keyStateRef = useRef<{ left: boolean; right: boolean }>({
    left: false,
    right: false,
  });

  const screenFlashRef = useRef<{ type: "good" | "bad" | null; until: number }>({
    type: null,
    until: 0,
  });

  const [canvasHeight, setCanvasHeight] = useState<number>(560);

  const gameMetrics = useMemo(
    () => ({
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
    }),
    []
  );

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const updateResponsiveHeight = () => {
      const width = wrapper.clientWidth;
      const ratio = GAME_HEIGHT / GAME_WIDTH;
      const nextHeight = width * ratio;
      setCanvasHeight(nextHeight);
    };

    updateResponsiveHeight();

    resizeObserverRef.current = new ResizeObserver(() => {
      updateResponsiveHeight();
    });

    resizeObserverRef.current.observe(wrapper);

    return () => {
      resizeObserverRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        keyStateRef.current.left = true;
      }
      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        keyStateRef.current.right = true;
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        keyStateRef.current.left = false;
      }
      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        keyStateRef.current.right = false;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      itemsRef.current = [];
      hitEffectsRef.current = [];
      return;
    }

    const isSmallScreen =
      typeof window !== "undefined" ? window.innerWidth < 640 : false;

    stateRef.current = { ...INITIAL_GAME_STATE };
    playerRef.current = {
      ...INITIAL_PLAYER,
      width: isSmallScreen ? 185 : 160,
      height: isSmallScreen ? 58 : 54,
      x: GAME_WIDTH / 2 - (isSmallScreen ? 185 : 160) / 2,
    };

    itemsRef.current = [];
    hitEffectsRef.current = [];
    lastSpawnTimeRef.current = 0;
    startTimeRef.current = performance.now();
    lastTimerSecondRef.current = 0;
    screenFlashRef.current = { type: null, until: 0 };

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    const renderFrame = (now: number) => {
      const elapsed = Math.floor((now - startTimeRef.current) / 1000);

      if (elapsed !== lastTimerSecondRef.current) {
        lastTimerSecondRef.current = elapsed;
        const currentLevel = getLevelFromElapsed(elapsed);
        stateRef.current.level = currentLevel;
        stateRef.current.elapsedSeconds = elapsed;
      }

      const direction = keyStateRef.current.left
        ? "left"
        : keyStateRef.current.right
        ? "right"
        : null;

      playerRef.current = movePlayer(playerRef.current, direction);

      const spawnInterval = getSpawnInterval(stateRef.current.level);
      if (now - lastSpawnTimeRef.current >= spawnInterval) {
        itemsRef.current.push(createFallingItem(stateRef.current.level));
        lastSpawnTimeRef.current = now;
      }

      itemsRef.current = itemsRef.current
        .map((item) => ({
          ...item,
          y: item.y + item.speed,
          rotation: item.rotation + item.rotationSpeed,
        }))
        .filter((item) => item.y <= GAME_HEIGHT + 70);

      const remainingItems: FallingItem[] = [];

      for (const item of itemsRef.current) {
        if (checkCollision(item, playerRef.current)) {
          const prevScore = stateRef.current.score;
          stateRef.current = applyCatchEffect(item.type, stateRef.current, now);

          const gained = stateRef.current.score - prevScore;

          if (isBadItem(item.type)) {
            screenFlashRef.current = { type: "bad", until: now + 120 };
          } else {
            screenFlashRef.current = { type: "good", until: now + 90 };
          }

          if (item.type === "heavy_drop") {
            playerRef.current = {
              ...playerRef.current,
              speed: Math.max(5, playerRef.current.speed - 1),
            };

            window.setTimeout(() => {
              playerRef.current = {
                ...playerRef.current,
                speed: INITIAL_PLAYER.speed,
              };
            }, 1300);
          }

          hitEffectsRef.current.push({
            id: crypto.randomUUID(),
            x: item.x,
            y: item.y,
            text: formatHitText(item.type, gained),
            color: getHitColor(item.type),
            createdAt: now,
          });

          if (stateRef.current.isGameOver) {
            break;
          }
        } else {
          remainingItems.push(item);
        }
      }

      itemsRef.current = remainingItems;
      hitEffectsRef.current = hitEffectsRef.current.filter(
        (effect) => now - effect.createdAt < 700
      );

      const multiplierActive =
        !!stateRef.current.multiplierActiveUntil &&
        stateRef.current.multiplierActiveUntil > now;

      window.dispatchEvent(
        new CustomEvent("risen-rush-update", {
          detail: {
            score: stateRef.current.score,
            lives: stateRef.current.lives,
            level: stateRef.current.level,
            elapsedSeconds: stateRef.current.elapsedSeconds,
            comboMultiplier: stateRef.current.comboMultiplier,
            multiplierActive,
          },
        })
      );

      ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      drawBackground(ctx, stateRef.current.level, multiplierActive);
      drawItems(ctx, itemsRef.current);
      drawHitEffects(ctx, hitEffectsRef.current, now);
      drawPlayerVault(ctx, playerRef.current);

      if (
        screenFlashRef.current.type === "good" &&
        screenFlashRef.current.until > now
      ) {
        drawScreenFlash(ctx, "rgba(250, 204, 21, 0.06)");
      }

      if (
        screenFlashRef.current.type === "bad" &&
        screenFlashRef.current.until > now
      ) {
        drawScreenFlash(ctx, "rgba(239, 68, 68, 0.08)");
      }

      if (stateRef.current.isGameOver) {
        onGameOver({
          finalScore: stateRef.current.score,
          durationSeconds: stateRef.current.elapsedSeconds,
          levelReached: stateRef.current.level,
          livesRemaining: stateRef.current.lives,
        });
        return;
      }

      animationFrameRef.current = requestAnimationFrame(renderFrame);
    };

    animationFrameRef.current = requestAnimationFrame(renderFrame);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, onGameOver]);

  const moveBasketToClientX = (clientX: number) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const rect = wrapper.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const scaledX = (relativeX / rect.width) * GAME_WIDTH;
    const nextX = scaledX - playerRef.current.width / 2;

    playerRef.current = {
      ...playerRef.current,
      x: Math.max(0, Math.min(GAME_WIDTH - playerRef.current.width, nextX)),
    };
  };

  return (
    <div className="rounded-[28px] border border-white/10 bg-[#030913] p-2 sm:p-3 shadow-2xl">
      <div className="mb-2 sm:mb-3 flex items-center justify-between text-[11px] sm:text-sm text-white/65">
        <span>Move: drag, mouse, ← →, A / D</span>
        <span className="hidden sm:inline">Catch $RSN. Avoid destructive drops.</span>
        <span className="sm:hidden">Drag to move basket.</span>
      </div>

      <div
        ref={wrapperRef}
        className="relative w-full"
        onPointerMove={(event) => {
          moveBasketToClientX(event.clientX);
        }}
        onPointerDown={(event) => {
          moveBasketToClientX(event.clientX);
        }}
      >
        <canvas
          ref={canvasRef}
          width={gameMetrics.width}
          height={gameMetrics.height}
          style={{ height: `${canvasHeight}px` }}
          className="w-full rounded-[22px] bg-[#06101a] touch-none"
        />

        <div className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 rounded-full border border-white/10 bg-[#04101a]/78 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-white/65 backdrop-blur sm:hidden">
          Drag basket
        </div>
      </div>
    </div>
  );
}

function formatHitText(type: FallingItemType, gained: number) {
  if (type === "normal_rsn") return `+${Math.max(gained, 50)}`;
  if (type === "golden_rsn") return `+${Math.max(gained, 200)}`;
  if (type === "multiplier") return "2X";
  if (type === "streak") return "STREAK";
  if (type === "red_crash_orb") return "-120";
  if (type === "heavy_drop") return "-80";
  return "-100";
}

function getHitColor(type: FallingItemType) {
  if (type === "normal_rsn") return "#facc15";
  if (type === "golden_rsn") return "#fde68a";
  if (type === "multiplier") return "#7dd3fc";
  if (type === "streak") return "#c4b5fd";
  return "#fca5a5";
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  level: number,
  multiplierActive: boolean
) {
  const gradient = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
  gradient.addColorStop(0, "#06101a");
  gradient.addColorStop(1, "#02070d");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  for (let i = 0; i < 28; i += 1) {
    const x = 30 + i * 32;
    const y = 40 + ((i % 6) * 78);
    ctx.fillStyle = "rgba(255,255,255,0.035)";
    ctx.beginPath();
    ctx.arc(x, y, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = "rgba(255,255,255,0.03)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 6; i += 1) {
    ctx.beginPath();
    ctx.moveTo(0, 70 + i * 90);
    ctx.lineTo(GAME_WIDTH, 70 + i * 90);
    ctx.stroke();
  }

  const levelGlow = Math.min(level * 0.015, 0.12);
  ctx.fillStyle = `rgba(250, 204, 21, ${levelGlow})`;
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  if (multiplierActive) {
    ctx.fillStyle = "rgba(125, 211, 252, 0.05)";
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  }
}

function drawScreenFlash(ctx: CanvasRenderingContext2D, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
}

function drawPlayerVault(ctx: CanvasRenderingContext2D, player: Player) {
  const x = player.x;
  const y = player.y;
  const w = player.width;
  const h = player.height;

  ctx.save();

  ctx.shadowColor = "rgba(212, 175, 55, 0.28)";
  ctx.shadowBlur = 18;

  const bodyGradient = ctx.createLinearGradient(x, y, x, y + h);
  bodyGradient.addColorStop(0, "#d4af37");
  bodyGradient.addColorStop(0.45, "#a57f1b");
  bodyGradient.addColorStop(1, "#4c3910");

  ctx.fillStyle = bodyGradient;
  roundedRectPath(ctx, x + 10, y + 14, w - 20, h - 18, 14);
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(255,255,255,0.28)";
  ctx.lineWidth = 2;
  roundedRectPath(ctx, x + 10, y + 14, w - 20, h - 18, 14);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x + 18, y + 18);
  ctx.quadraticCurveTo(x + w / 2, y - 8, x + w - 18, y + 18);
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#f6d365";
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x + 32, y + 20);
  ctx.quadraticCurveTo(x + w / 2, y + 2, x + w - 32, y + 20);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(255,255,255,0.35)";
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,0.1)";
  roundedRectPath(ctx, x + 26, y + 24, w - 52, 10, 6);
  ctx.fill();

  ctx.fillStyle = "rgba(14, 25, 36, 0.85)";
  roundedRectPath(ctx, x + 24, y + 28, w - 48, h - 24, 10);
  ctx.fill();

  ctx.restore();
}

function drawItems(ctx: CanvasRenderingContext2D, items: FallingItem[]) {
  for (const item of items) {
    if (item.type === "normal_rsn") {
      drawRSNCoin(ctx, item, false);
      continue;
    }

    if (item.type === "golden_rsn") {
      drawRSNCoin(ctx, item, true);
      continue;
    }

    if (item.type === "multiplier") {
      drawEnergyOrb(ctx, item, "#7dd3fc", "2X");
      continue;
    }

    if (item.type === "streak") {
      drawEnergyOrb(ctx, item, "#a78bfa", "⚡");
      continue;
    }

    if (item.type === "red_crash_orb") {
      drawHazardOrb(ctx, item, "#ef4444", "X");
      continue;
    }

    if (item.type === "heavy_drop") {
      drawHeavyBlock(ctx, item);
      continue;
    }

    if (item.type === "glitch_block") {
      drawGlitchCube(ctx, item);
    }
  }
}

function drawRSNCoin(
  ctx: CanvasRenderingContext2D,
  item: FallingItem,
  golden: boolean
) {
  const cx = item.x + item.size / 2;
  const cy = item.y + item.size / 2;
  const r = item.size / 2;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(item.rotation);

  ctx.shadowColor = golden
    ? "rgba(253, 230, 138, 0.7)"
    : "rgba(212, 175, 55, 0.55)";
  ctx.shadowBlur = golden ? 22 : 14;

  const fill = ctx.createRadialGradient(-4, -4, 2, 0, 0, r);
  fill.addColorStop(0, golden ? "#fff7d6" : "#f8e39c");
  fill.addColorStop(0.42, golden ? "#f6d365" : "#d4af37");
  fill.addColorStop(1, golden ? "#a16c06" : "#7a5b12");

  ctx.beginPath();
  ctx.fillStyle = fill;
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = "rgba(255,255,255,0.35)";
  ctx.stroke();

  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(9,16,24,0.35)";
  ctx.arc(0, 0, r - 5, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "#091018";
  ctx.font = `bold ${golden ? 12 : 11}px Arial`;
  ctx.textAlign = "center";
  ctx.fillText(golden ? "G" : "RSN", 0, 4);

  ctx.restore();
}

function drawEnergyOrb(
  ctx: CanvasRenderingContext2D,
  item: FallingItem,
  color: string,
  label: string
) {
  const cx = item.x + item.size / 2;
  const cy = item.y + item.size / 2;
  const r = item.size / 2;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(item.rotation);

  ctx.shadowColor = color;
  ctx.shadowBlur = 20;

  const g = ctx.createRadialGradient(-4, -4, 2, 0, 0, r);
  g.addColorStop(0, "#ffffff");
  g.addColorStop(0.3, color);
  g.addColorStop(1, "rgba(5,10,16,0.95)");

  ctx.beginPath();
  ctx.fillStyle = g;
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(255,255,255,0.35)";
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-r + 6, 0);
  ctx.lineTo(r - 6, 0);
  ctx.moveTo(0, -r + 6);
  ctx.lineTo(0, r - 6);
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 11px Arial";
  ctx.textAlign = "center";
  ctx.fillText(label, 0, 4);

  ctx.restore();
}

function drawHazardOrb(
  ctx: CanvasRenderingContext2D,
  item: FallingItem,
  color: string,
  label: string
) {
  const cx = item.x + item.size / 2;
  const cy = item.y + item.size / 2;
  const r = item.size / 2;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(item.rotation);

  ctx.shadowColor = color;
  ctx.shadowBlur = 18;

  const g = ctx.createRadialGradient(-4, -4, 2, 0, 0, r);
  g.addColorStop(0, "#ffd3d3");
  g.addColorStop(0.28, "#ef4444");
  g.addColorStop(1, "#3b0a0a");

  ctx.beginPath();
  ctx.fillStyle = g;
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(255,255,255,0.28)";
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-r / 2, -r / 2);
  ctx.lineTo(r / 2, r / 2);
  ctx.moveTo(r / 2, -r / 2);
  ctx.lineTo(-r / 2, r / 2);
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(255,255,255,0.5)";
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 12px Arial";
  ctx.textAlign = "center";
  ctx.fillText(label, 0, 4);

  ctx.restore();
}

function drawHeavyBlock(ctx: CanvasRenderingContext2D, item: FallingItem) {
  ctx.save();
  const x = item.x;
  const y = item.y;
  const s = item.size;
  const cx = x + s / 2;
  const cy = y + s / 2;

  ctx.translate(cx, cy);
  ctx.rotate(item.rotation * 0.5);

  ctx.shadowColor = "rgba(239, 68, 68, 0.3)";
  ctx.shadowBlur = 12;

  const g = ctx.createLinearGradient(-s / 2, -s / 2, s / 2, s / 2);
  g.addColorStop(0, "#6b7280");
  g.addColorStop(0.5, "#374151");
  g.addColorStop(1, "#111827");

  ctx.fillStyle = g;
  roundedRectPath(ctx, -s / 2, -s / 2, s, s, 8);
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.lineWidth = 2;
  roundedRectPath(ctx, -s / 2, -s / 2, s, s, 8);
  ctx.stroke();

  ctx.strokeStyle = "rgba(239,68,68,0.35)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-s / 3, -s / 3);
  ctx.lineTo(s / 3, s / 3);
  ctx.moveTo(s / 3, -s / 3);
  ctx.lineTo(-s / 3, s / 3);
  ctx.stroke();

  ctx.restore();
}

function drawGlitchCube(ctx: CanvasRenderingContext2D, item: FallingItem) {
  ctx.save();
  const x = item.x;
  const y = item.y;
  const s = item.size;
  const cx = x + s / 2;
  const cy = y + s / 2;

  ctx.translate(cx, cy);
  ctx.rotate(item.rotation);

  ctx.shadowColor = "rgba(147, 51, 234, 0.45)";
  ctx.shadowBlur = 14;

  ctx.fillStyle = "#14142b";
  roundedRectPath(ctx, -s / 2, -s / 2, s, s, 7);
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.lineWidth = 2;
  roundedRectPath(ctx, -s / 2, -s / 2, s, s, 7);
  ctx.stroke();

  ctx.fillStyle = "#ef4444";
  ctx.fillRect(-s / 2 + 4, -s / 2 + 6, s - 8, 4);
  ctx.fillStyle = "#7dd3fc";
  ctx.fillRect(-s / 2 + 8, 0, s - 16, 3);
  ctx.fillStyle = "#a78bfa";
  ctx.fillRect(-s / 2 + 5, s / 2 - 10, s - 10, 3);

  ctx.restore();
}

function drawHitEffects(
  ctx: CanvasRenderingContext2D,
  effects: HitEffect[],
  now: number
) {
  effects.forEach((effect) => {
    const age = now - effect.createdAt;
    const progress = age / 700;
    const alpha = 1 - progress;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = effect.color;
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "center";
    ctx.shadowColor = effect.color;
    ctx.shadowBlur = 10;
    ctx.fillText(effect.text, effect.x + 18, effect.y - progress * 30);
    ctx.restore();
  });
}

function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}