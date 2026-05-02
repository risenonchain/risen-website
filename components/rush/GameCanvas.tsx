// GameCanvas.tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { rushAudio } from "@/lib/rushAudio";
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
  isPremium?: boolean;
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

type CornerGain = {
  id: string;
  text: string;
  tone: "good" | "bad" | "neutral";
};

type Particle = {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
};

export default function GameCanvas({ isPlaying, isPremium = false, onGameOver }: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const itemsRef = useRef<FallingItem[]>([]);
  const hitEffectsRef = useRef<HitEffect[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const lastSpawnTimeRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const lastTimerSecondRef = useRef<number>(0);

  const pausedAtRef = useRef<number | null>(null);
  const totalPausedDurationRef = useRef<number>(0);
  const isPausedRef = useRef<boolean>(false);
  const isRunningRef = useRef<boolean>(false);

  const heavyDropSlowUntilRef = useRef<number | null>(null);
  const screenShakeUntilRef = useRef<number | null>(null);
  const levelUpBannerUntilRef = useRef<number | null>(null);

  const playerRef = useRef<Player>({ ...INITIAL_PLAYER });
  const stateRef = useRef({ ...INITIAL_GAME_STATE });

  const pointerXRef = useRef<number | null>(null);
  const wrapperRectRef = useRef<DOMRect | null>(null);

  const keyStateRef = useRef<{ left: boolean; right: boolean }>({
    left: false,
    right: false,
  });

  const screenFlashRef = useRef<{ type: "good" | "bad" | null; until: number }>({
    type: null,
    until: 0,
  });

  const [canvasHeight, setCanvasHeight] = useState<number>(560);
  const [canvasWidth, setCanvasWidth] = useState<number>(900);
  const [isPaused, setIsPaused] = useState(false);
  const [cornerGain, setCornerGain] = useState<CornerGain | null>(null);

  const cornerGainTimeoutRef = useRef<number | null>(null);

  const gameMetrics = useMemo(
    () => ({
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
    }),
    []
  );

  const canPause = isPlaying && !stateRef.current.isGameOver;

  const clearCornerGainTimer = useCallback(() => {
    if (cornerGainTimeoutRef.current !== null) {
      window.clearTimeout(cornerGainTimeoutRef.current);
      cornerGainTimeoutRef.current = null;
    }
  }, []);

  const showCornerGain = useCallback(
    (text: string, tone: CornerGain["tone"]) => {
      const next: CornerGain = {
        id: crypto.randomUUID(),
        text,
        tone,
      };

      setCornerGain(next);
      clearCornerGainTimer();

      cornerGainTimeoutRef.current = window.setTimeout(() => {
        setCornerGain((current) => (current?.id === next.id ? null : current));
      }, 850);
    },
    [clearCornerGainTimer]
  );

  const spawnParticles = (x: number, y: number, color: string, count: number) => {
    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        id: crypto.randomUUID(),
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        size: Math.random() * 4 + 2,
        color,
        life: 1,
        maxLife: Math.random() * 0.5 + 0.5,
      });
    }
  };

  const broadcastHudUpdate = useCallback((now: number) => {
    // Throttled in loop to save main thread
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
          isPaused: isPausedRef.current,
        },
      })
    );
  }, []);

  const drawCurrentFrame = useCallback((now: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    const multiplierActive =
      !!stateRef.current.multiplierActiveUntil &&
      stateRef.current.multiplierActiveUntil > now;

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Apply Screen Shake
    if (screenShakeUntilRef.current && screenShakeUntilRef.current > now) {
      const intensity = isMobileRef.current ? 4 : 8;
      ctx.save();
      ctx.translate((Math.random() - 0.5) * intensity, (Math.random() - 0.5) * intensity);
    }

    drawBackground(ctx, stateRef.current.level, multiplierActive);
    drawItems(ctx, itemsRef.current);
    drawParticles(ctx, particlesRef.current, now);
    drawHitEffects(ctx, hitEffectsRef.current, now);
    drawPlayerVault(ctx, playerRef.current, stateRef.current.isPremium);

    // Draw In-Game HUD (Score & Lives)
    drawInGameHUD(ctx, stateRef.current.score, stateRef.current.lives, multiplierActive, stateRef.current.elapsedSeconds, stateRef.current.isPremium);

    if (screenShakeUntilRef.current && screenShakeUntilRef.current > now) {
      ctx.restore();
    }

    // Level Up Banner
    if (levelUpBannerUntilRef.current && levelUpBannerUntilRef.current > now) {
      drawLevelUpBanner(ctx, stateRef.current.level, now, levelUpBannerUntilRef.current);
    }

    if (
      !isPausedRef.current &&
      screenFlashRef.current.type === "good" &&
      screenFlashRef.current.until > now
    ) {
      drawScreenFlash(ctx, "rgba(250, 204, 21, 0.06)");
    }

    if (
      !isPausedRef.current &&
      screenFlashRef.current.type === "bad" &&
      screenFlashRef.current.until > now
    ) {
      drawScreenFlash(ctx, "rgba(239, 68, 68, 0.08)");
    }

    if (isPausedRef.current) {
      drawPausedOverlay(ctx);
    }
  }, []);

  const stopLoop = useCallback(() => {
    isRunningRef.current = false;

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const scheduleNextFrame = useCallback(() => {
    if (!isPlaying || isPausedRef.current || stateRef.current.isGameOver) {
      stopLoop();
      return;
    }

    isRunningRef.current = true;
    animationFrameRef.current = requestAnimationFrame((now) => {
      gameLoopRef.current(now);
    });
  }, [isPlaying, stopLoop]);

  // High-Performance Engine Logic
  const lastUpdateRef = useRef<number>(0);
  const lastHudUpdateRef = useRef<number>(0);
  const accumulatorRef = useRef<number>(0);
  const FIXED_TIMESTEP = 1000 / 60; // Locked 60fps logic
  const isMobileRef = useRef<boolean>(false);

  useEffect(() => {
    isMobileRef.current = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }, []);

  const pauseGame = useCallback(() => {
    if (!isPlaying || stateRef.current.isGameOver || isPausedRef.current) return;

    isPausedRef.current = true;
    setIsPaused(true);
    pausedAtRef.current = performance.now();

    stopLoop();
    drawCurrentFrame(pausedAtRef.current);
    broadcastHudUpdate(pausedAtRef.current);
  }, [broadcastHudUpdate, drawCurrentFrame, isPlaying, stopLoop]);

  const resumeGame = useCallback(() => {
    if (!isPlaying || stateRef.current.isGameOver || !isPausedRef.current) return;

    const now = performance.now();

    if (pausedAtRef.current !== null) {
      totalPausedDurationRef.current += now - pausedAtRef.current;
      pausedAtRef.current = null;
    }

    isPausedRef.current = false;
    setIsPaused(false);
    lastSpawnTimeRef.current = now;

    broadcastHudUpdate(now);
    scheduleNextFrame();
  }, [broadcastHudUpdate, isPlaying, scheduleNextFrame]);

  const togglePause = useCallback(() => {
    if (!isPlaying || stateRef.current.isGameOver) return;

    if (isPausedRef.current) {
      resumeGame();
    } else {
      pauseGame();
    }
  }, [isPlaying, pauseGame, resumeGame]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const updateResponsiveHeight = () => {
      const width = wrapper.clientWidth;
      const height = wrapper.clientHeight;

      if (isPlaying && height > 0) {
        const targetRatio = GAME_WIDTH / GAME_HEIGHT;
        const screenRatio = width / height;

        if (screenRatio > targetRatio) {
          // Tablet/Wide screen: Lock width to maintain ratio
          setCanvasWidth(height * targetRatio);
          setCanvasHeight(height);
        } else {
          // Phone/Tall screen: Use full width
          setCanvasWidth(width);
          setCanvasHeight(height);
        }
      } else {
        const ratio = GAME_HEIGHT / GAME_WIDTH;
        setCanvasWidth(width);
        setCanvasHeight(width * ratio);
      }

      // Rect update needs to happen after state updates usually,
      // but we use a small timeout or just read from DOM directly in the loop.
      setTimeout(() => {
        if (wrapperRef.current) wrapperRectRef.current = wrapperRef.current.getBoundingClientRect();
      }, 50);
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
      const key = event.key.toLowerCase();

      if (key === "p" || event.key === "Escape") {
        if (isPlaying && !stateRef.current.isGameOver) {
          event.preventDefault();
          togglePause();
        }
        return;
      }

      if (isPausedRef.current) return;

      if (event.key === "ArrowLeft" || key === "a") {
        keyStateRef.current.left = true;
      }
      if (event.key === "ArrowRight" || key === "d") {
        keyStateRef.current.right = true;
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (event.key === "ArrowLeft" || key === "a") {
        keyStateRef.current.left = false;
      }
      if (event.key === "ArrowRight" || key === "d") {
        keyStateRef.current.right = false;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [isPlaying, togglePause]);

  const gameLoopRef = useRef<(now: number) => void>(() => {});

  gameLoopRef.current = (now: number) => {
    if (!isPlaying || isPausedRef.current) {
      stopLoop();
      return;
    }

    // Delta Timing for Smooth Motion
    if (!lastUpdateRef.current) lastUpdateRef.current = now;
    const deltaTime = now - lastUpdateRef.current;
    lastUpdateRef.current = now;

    // Cap delta to prevent huge jumps during background tasks
    accumulatorRef.current += Math.min(deltaTime, 50);

    let physicsUpdated = false;
    while (accumulatorRef.current >= FIXED_TIMESTEP) {
      physicsUpdated = true;
      const loopNow = performance.now();
      const effectiveElapsedMs =
        loopNow - startTimeRef.current - totalPausedDurationRef.current;

      const elapsed = Math.floor(effectiveElapsedMs / 1000);

      if (elapsed !== lastTimerSecondRef.current) {
        lastTimerSecondRef.current = elapsed;
        const currentLevel = getLevelFromElapsed(elapsed);

        if (currentLevel > stateRef.current.level) {
          levelUpBannerUntilRef.current = performance.now() + 2500;
          rushAudio.playLevelUp();
        }

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
      if (performance.now() - lastSpawnTimeRef.current >= spawnInterval) {
        itemsRef.current.push(createFallingItem(stateRef.current.level));
        lastSpawnTimeRef.current = performance.now();
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
          stateRef.current = applyCatchEffect(item.type, stateRef.current, performance.now());

          const gained = stateRef.current.score - prevScore;
          const hitText = formatHitText(item.type, gained);

          if (isBadItem(item.type)) {
            screenFlashRef.current = { type: "bad", until: performance.now() + 120 };
            screenShakeUntilRef.current = performance.now() + 250;
            rushAudio.playHazard();
            if (typeof window !== "undefined" && navigator.vibrate) {
              navigator.vibrate(50);
            }
          } else {
            screenFlashRef.current = { type: "good", until: performance.now() + 90 };
            if (item.type === "golden_rsn") {
              rushAudio.playGolden();
            } else {
              rushAudio.playCoin();
            }
            spawnParticles(item.x + item.size / 2, item.y + item.size / 2, getHitColor(item.type), 8);
          }

          if (item.type === "heavy_drop") {
            playerRef.current = {
              ...playerRef.current,
              speed: Math.max(5, playerRef.current.speed - 1),
            };
            heavyDropSlowUntilRef.current = performance.now() + 1300;
          }

          hitEffectsRef.current.push({
            id: crypto.randomUUID(),
            x: item.x,
            y: item.y,
            text: hitText,
            color: getHitColor(item.type),
            createdAt: performance.now(),
          });

          if (shouldShowCornerGain(item.type, gained)) {
            showCornerGain(
              hitText,
              gained > 0 ? "good" : gained < 0 ? "bad" : "neutral"
            );
          }

          if (stateRef.current.isGameOver) {
            break;
          }
        } else {
          remainingItems.push(item);
        }
      }

      itemsRef.current = remainingItems;
      accumulatorRef.current -= FIXED_TIMESTEP;
    }

    hitEffectsRef.current = hitEffectsRef.current.filter(
      (effect) => performance.now() - effect.createdAt < 700
    );

    // Particles update - optimized loop
    const particles = particlesRef.current;
    const pLen = particles.length;
    const nextParticles = [];
    const lifeDecay = 16 / 1000;

    for (let i = 0; i < pLen; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= lifeDecay / p.maxLife;
      if (p.life > 0) {
        nextParticles.push(p);
      }
    }
    particlesRef.current = nextParticles;

    drawCurrentFrame(now);

    // Throttled HUD update: only every ~150ms to save main thread
    const nowMs = performance.now();
    if (!lastHudUpdateRef.current || nowMs - lastHudUpdateRef.current > 150) {
      broadcastHudUpdate(nowMs);
      lastHudUpdateRef.current = nowMs;
    }

    if (stateRef.current.isGameOver) {
      stopLoop();
      onGameOver({
        finalScore: stateRef.current.score,
        durationSeconds: stateRef.current.elapsedSeconds,
        levelReached: stateRef.current.level,
        livesRemaining: stateRef.current.lives,
      });
      return;
    }

    scheduleNextFrame();
  };

  useEffect(() => {
    if (!isPlaying) {
      stopLoop();
      itemsRef.current = [];
      hitEffectsRef.current = [];
      pausedAtRef.current = null;
      totalPausedDurationRef.current = 0;
      heavyDropSlowUntilRef.current = null;
      keyStateRef.current = { left: false, right: false };
      screenFlashRef.current = { type: null, until: 0 };
      isPausedRef.current = false;
      setIsPaused(false);
      clearCornerGainTimer();
      setCornerGain(null);
      return;
    }

    const isSmallScreen =
      typeof window !== "undefined" ? window.innerWidth < 640 : false;

    stateRef.current = { ...INITIAL_GAME_STATE, isPremium };
    playerRef.current = {
      ...INITIAL_PLAYER,
      width: isSmallScreen ? 185 : 160,
      height: isSmallScreen ? 58 : 54,
      x: GAME_WIDTH / 2 - (isSmallScreen ? 185 : 160) / 2,
    };

    itemsRef.current = [];
    hitEffectsRef.current = [];
    lastSpawnTimeRef.current = performance.now();
    startTimeRef.current = performance.now();
    lastTimerSecondRef.current = 0;
    pausedAtRef.current = null;
    totalPausedDurationRef.current = 0;
    heavyDropSlowUntilRef.current = null;
    screenFlashRef.current = { type: null, until: 0 };
    keyStateRef.current = { left: false, right: false };
    isPausedRef.current = false;
    setIsPaused(false);
    clearCornerGainTimer();
    setCornerGain(null);

    drawCurrentFrame(startTimeRef.current);
    broadcastHudUpdate(startTimeRef.current);
    scheduleNextFrame();

    return () => {
      stopLoop();
      clearCornerGainTimer();
    };
  }, [
    broadcastHudUpdate,
    clearCornerGainTimer,
    drawCurrentFrame,
    isPlaying,
    scheduleNextFrame,
    stopLoop,
  ]);

  const moveBasketToClientX = (clientX: number) => {
    if (isPausedRef.current) return;

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const rect = wrapper.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const scaledX = (relativeX / rect.width) * GAME_WIDTH;
    const targetX = scaledX - playerRef.current.width / 2;

    playerRef.current.x = Math.max(0, Math.min(GAME_WIDTH - playerRef.current.width, targetX));
  };

  return (
    <div className={`rounded-[28px] border border-white/10 bg-[#030913] p-2 sm:p-3 shadow-2xl ${isPlaying ? "flex-1 flex flex-col h-full border-none !p-0 !rounded-none" : ""}`}>
      <div className={`mb-2 sm:mb-3 flex items-center justify-between gap-3 text-[11px] sm:text-sm text-white/65 ${isPlaying ? "absolute bottom-10 left-0 right-0 z-30 px-6 pointer-events-none" : ""}`}>
        <span className={isPlaying ? "hidden" : ""}>Move: drag, mouse, ← →, A / D</span>
        <span className="hidden sm:inline">
          {isPaused
            ? "Game paused. Press P or Resume."
            : "Catch $RSN. Avoid destructive drops."}
        </span>
        <div className="flex items-center justify-between w-full sm:w-auto gap-4 pointer-events-auto">
          {isPlaying && (
            <span className="text-white/40 uppercase tracking-[0.2em] font-medium text-[10px]">
              System Version 1.0.4
            </span>
          )}
          <button
            type="button"
            onClick={togglePause}
            disabled={!canPause}
            className={`pointer-events-auto rounded-full border px-5 py-2 text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${
              isPaused
                ? "border-risen-primary bg-risen-primary/20 text-white shadow-[0_0_15px_rgba(46,219,255,0.4)]"
                : "border-white/20 bg-black/40 text-white/70 hover:border-white/40 backdrop-blur-md"
            }`}
          >
            {isPaused ? "Resume Connection" : "Pause System"}
          </button>
        </div>
      </div>

      <div
        ref={wrapperRef}
        className={`relative w-full ${isPlaying ? "flex-1 h-full animate-[pageFadeIn_0.6s_ease-out]" : ""}`}
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
          style={{
            height: `${canvasHeight}px`,
            width: `${canvasWidth}px`,
            margin: '0 auto' // Center the game on wide screens
          }}
          className={`bg-[#06101a] touch-none block ${isPlaying ? "" : "rounded-[22px] w-full"}`}
        />

        <div className="pointer-events-none absolute right-3 top-3 z-20 flex min-h-[42px] items-start justify-end">
          {cornerGain ? (
            <div
              key={cornerGain.id}
              className={
                "animate-[fadeCornerGain_0.85s_ease-out_forwards] rounded-xl border px-4 py-2 text-[12px] font-bold uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-xl " +
                (cornerGain.tone === "good"
                  ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                  : cornerGain.tone === "bad"
                  ? "border-red-400/40 bg-red-400/10 text-red-300"
                  : "border-risen-primary/40 bg-risen-primary/10 text-risen-primary")
              }
            >
              {cornerGain.text}
            </div>
          ) : null}
        </div>

        {!isPaused && isPlaying && (
          <div className="pointer-events-none absolute left-1/2 bottom-24 -translate-x-1/2 opacity-30 animate-pulse">
            <div className="flex flex-col items-center gap-2">
               <div className="w-12 h-0.5 bg-white/40 rounded-full" />
               <span className="text-[9px] uppercase tracking-[0.4em] text-white">Manual Control</span>
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes fadeCornerGain {
            0% {
              opacity: 0;
              transform: translateY(-8px) scale(0.96);
            }
            12% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
            100% {
              opacity: 0;
              transform: translateY(-14px) scale(1.02);
            }
          }
        `}</style>
      </div>
    </div>
  );
}

function shouldShowCornerGain(type: FallingItemType, gained: number) {
  if (type === "multiplier" || type === "streak") return true;
  return gained !== 0;
}

function formatHitText(type: FallingItemType, gained: number) {
  if (type === "normal_rsn") return `+${Math.max(gained, 5)}`;
  if (type === "golden_rsn") return `+${Math.max(gained, 20)}`;
  if (type === "multiplier") return "2X";
  if (type === "streak") return "STREAK";
  if (type === "red_crash_orb") return `${Math.min(gained, -120)}`;
  if (type === "heavy_drop") return `${Math.min(gained, -80)}`;
  return `${Math.min(gained, -100)}`;
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
  const now = performance.now();
  const shift = (now / 60) % GAME_HEIGHT;

  // Deep Space Gradient - Use 2 stops instead of 3 for speed
  const gradient = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
  gradient.addColorStop(0, "#010812");
  gradient.addColorStop(1, "#01050a");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  // Simplified Starfield
  // Layer 1: Slow
  ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
  for (let i = 0; i < 25; i += 1) {
    const x = (i * 137) % GAME_WIDTH;
    const y = (i * 243 + shift * 0.3) % GAME_HEIGHT;
    ctx.fillRect(x, y, 1, 1);
  }

  // Layer 2: Medium
  ctx.fillStyle = "rgba(46, 219, 255, 0.2)";
  for (let i = 0; i < 12; i += 1) {
    const x = (i * 567) % GAME_WIDTH;
    const y = (i * 389 + shift * 0.7) % GAME_HEIGHT;
    ctx.fillRect(x, y, 2, 2);
  }

  // Optimized Grid
  ctx.strokeStyle = "rgba(255,255,255,0.012)";
  ctx.lineWidth = 1;
  const hStep = GAME_HEIGHT / 8;
  const wStep = GAME_WIDTH / 6;
  for (let i = 0; i < 8; i += 1) {
    ctx.beginPath();
    ctx.moveTo(0, i * hStep);
    ctx.lineTo(GAME_WIDTH, i * hStep);
    ctx.stroke();
  }
  for (let i = 0; i < 6; i += 1) {
    ctx.beginPath();
    ctx.moveTo(i * wStep, 0);
    ctx.lineTo(i * wStep, GAME_HEIGHT);
    ctx.stroke();
  }

  if (multiplierActive) {
    ctx.fillStyle = "rgba(125, 211, 252, 0.03)";
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  }

  // Simplified Vignette
  const vignette = ctx.createRadialGradient(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH / 2.5, GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_HEIGHT);
  vignette.addColorStop(0, "transparent");
  vignette.addColorStop(1, "rgba(0, 0, 0, 0.5)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
}

function drawScreenFlash(ctx: CanvasRenderingContext2D, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
}

function drawPausedOverlay(ctx: CanvasRenderingContext2D) {
  ctx.save();

  ctx.fillStyle = "rgba(2, 7, 13, 0.45)";
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.textAlign = "center";

  ctx.font = "bold 38px Arial";
  ctx.fillText("Paused", GAME_WIDTH / 2, GAME_HEIGHT / 2 - 10);

  ctx.font = "16px Arial";
  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.fillText(
    "Press P or tap Resume to continue",
    GAME_WIDTH / 2,
    GAME_HEIGHT / 2 + 24
  );

  ctx.restore();
}

function drawPlayerVault(ctx: CanvasRenderingContext2D, player: Player, isPremium: boolean = false) {
  const x = player.x;
  const y = player.y;
  const w = player.width;
  const h = player.height;

  ctx.save();

  // ShadowBlur is expensive on mobile
  const useShadow = !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

  if (useShadow) {
    if (isPremium) {
      ctx.shadowColor = "rgba(255, 215, 0, 0.6)";
      ctx.shadowBlur = 25;
    } else {
      ctx.shadowColor = "rgba(212, 175, 55, 0.28)";
      ctx.shadowBlur = 18;
    }
  }

  const bodyGradient = ctx.createLinearGradient(x, y, x, y + h);
  if (isPremium) {
    // Brighter, more "PRIME" gold
    bodyGradient.addColorStop(0, "#FFD700");
    bodyGradient.addColorStop(0.45, "#FFC800");
    bodyGradient.addColorStop(1, "#B8860B");
  } else {
    bodyGradient.addColorStop(0, "#d4af37");
    bodyGradient.addColorStop(0.45, "#a57f1b");
    bodyGradient.addColorStop(1, "#4c3910");
  }

  ctx.fillStyle = bodyGradient;
  roundedRectPath(ctx, x + 10, y + 14, w - 20, h - 18, 14);
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.strokeStyle = isPremium ? "rgba(255, 255, 255, 0.6)" : "rgba(255,255,255,0.28)";
  ctx.lineWidth = isPremium ? 3 : 2;
  roundedRectPath(ctx, x + 10, y + 14, w - 20, h - 18, 14);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x + 18, y + 18);
  ctx.quadraticCurveTo(x + w / 2, y - 8, x + w - 18, y + 18);
  ctx.lineWidth = 6;
  ctx.strokeStyle = isPremium ? "#FFFFFF" : "#f6d365";
  ctx.stroke();

  if (isPremium) {
    // Add a "PRIME" text to the basket
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.font = "bold 10px Inter, Arial";
    ctx.textAlign = "center";
    ctx.fillText("PRIME VAULT", x + w / 2, y + h - 10);
  }

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

  // Skip shadow for standard items to save GPU
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (golden && !isMobile) {
    ctx.shadowColor = "rgba(253, 230, 138, 0.6)";
    ctx.shadowBlur = 15;
  }

  const fill = ctx.createRadialGradient(-2, -2, 1, 0, 0, r);
  fill.addColorStop(0, golden ? "#fff7d6" : "#f8e39c");
  fill.addColorStop(1, golden ? "#a16c06" : "#7a5b12");

  ctx.beginPath();
  ctx.fillStyle = fill;
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = "rgba(255,255,255,0.25)";
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

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (!isMobile) {
    ctx.shadowColor = color;
    ctx.shadowBlur = 20;
  }

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

  // Skip shadow for hazards to save GPU
  const g = ctx.createRadialGradient(-2, -2, 1, 0, 0, r);
  g.addColorStop(0, "#ffd3d3");
  g.addColorStop(0.3, color);
  g.addColorStop(1, "#3b0a0a");

  ctx.beginPath();
  ctx.fillStyle = g;
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.lineWidth = 1.5;
  ctx.strokeStyle = "rgba(255,255,255,0.25)";
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-r / 2.5, -r / 2.5);
  ctx.lineTo(r / 2.5, r / 2.5);
  ctx.moveTo(r / 2.5, -r / 2.5);
  ctx.lineTo(-r / 2.5, r / 2.5);
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = "rgba(255,255,255,0.4)";
  ctx.stroke();

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

function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[], now: number) {
  ctx.save();
  for (const p of particles) {
    ctx.globalAlpha = p.life;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawLevelUpBanner(ctx: CanvasRenderingContext2D, level: number, now: number, until: number) {
  const duration = 2500;
  const remaining = until - now;
  const progress = 1 - (remaining / duration);

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  ctx.save();
  ctx.translate(GAME_WIDTH / 2, GAME_HEIGHT / 2);

  // Slide and Fade
  let alpha = 1;
  if (progress < 0.2) alpha = progress / 0.2;
  if (progress > 0.8) alpha = (1 - progress) / 0.2;
  ctx.globalAlpha = alpha;

  // Background Strap
  ctx.fillStyle = "rgba(46, 219, 255, 0.15)";
  ctx.fillRect(-GAME_WIDTH / 2, -60, GAME_WIDTH, 120);

  if (!isMobile) {
    ctx.shadowColor = "#2EDBFF";
    ctx.shadowBlur = 20;
  }
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 80px Inter, Arial";
  ctx.textAlign = "center";
  ctx.fillText(`LEVEL ${level}`, 0, 15);

  ctx.font = "bold 20px Inter, Arial";
  ctx.fillStyle = "#2EDBFF";
  ctx.fillText("SYSTEM EVOLUTION COMPLETE", 0, 50);

  ctx.restore();
}

function drawInGameHUD(
  ctx: CanvasRenderingContext2D,
  score: number,
  lives: number,
  multiplierActive: boolean,
  elapsedSeconds: number,
  isPremium: boolean = false
) {
  ctx.save();

  // Top Area Shadow/Gradient for readability
  const headGrad = ctx.createLinearGradient(0, 0, 0, 100);
  headGrad.addColorStop(0, "rgba(0,0,0,0.6)");
  headGrad.addColorStop(1, "transparent");
  ctx.fillStyle = headGrad;
  ctx.fillRect(0, 0, GAME_WIDTH, 100);

  // Level Progress Bar (at the very top)
  const levelProgress = (elapsedSeconds % 60) / 60;
  ctx.fillStyle = isPremium ? "rgba(251, 191, 36, 0.1)" : "rgba(46, 219, 255, 0.1)";
  ctx.fillRect(0, 0, GAME_WIDTH, 4);
  ctx.fillStyle = isPremium ? "#FBBF24" : "#2EDBFF";
  ctx.shadowColor = isPremium ? "#FBBF24" : "#2EDBFF";
  ctx.shadowBlur = 10;
  ctx.fillRect(0, 0, GAME_WIDTH * levelProgress, 4);
  ctx.shadowBlur = 0;

  // Top Left: Score
  ctx.fillStyle = multiplierActive ? "#7dd3fc" : "#ffffff";
  ctx.shadowColor = multiplierActive ? "rgba(125, 211, 252, 0.8)" : "rgba(0,0,0,0.8)";
  ctx.shadowBlur = 15;

  // Label
  ctx.font = "bold 16px Inter, Arial";
  ctx.textAlign = "left";
  ctx.globalAlpha = 0.6;
  ctx.fillText(isPremium ? "PRIME POINTS" : "VAULT POINTS", 30, 45);

  // Value
  ctx.globalAlpha = 1;
  ctx.font = "bold 42px Inter, Arial";
  ctx.fillText(`${score.toLocaleString()}`, 30, 90);

  if (multiplierActive) {
    ctx.font = "bold 14px Inter, Arial";
    ctx.fillStyle = "#7dd3fc";
    ctx.fillText("● 2X MULTIPLIER", 30, 110);
  }

  // Top Right: Health/Status
  ctx.textAlign = "right";
  ctx.font = "bold 16px Inter, Arial";
  ctx.globalAlpha = 0.6;
  ctx.fillStyle = "#ffffff";
  ctx.fillText(isPremium ? "CORE INTEGRITY" : "SYSTEM STABILITY", GAME_WIDTH - 30, 40);

  // Hearts
  ctx.globalAlpha = 1;
  const heartIcon = isPremium ? "💎" : "❤️";
  ctx.font = "28px Arial";
  let livesText = "";
  for (let i = 0; i < lives; i++) {
    livesText += heartIcon;
  }
  ctx.fillText(livesText, GAME_WIDTH - 30, 80);

  ctx.restore();
}
