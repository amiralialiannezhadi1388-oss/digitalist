"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { useApp } from "@/context/AppContext";
import confetti from "canvas-confetti";
import {
  Play,
  RotateCcw,
  Trophy,
  Volume2,
  VolumeX,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Cpu,
  Layers,
  Sparkles,
  Gamepad2,
} from "lucide-react";

interface HighScore {
  id: number;
  playerName: string;
  score: number;
  levelReached: number;
  coinsCollected: number;
  createdAt: string;
}

export default function DigitalistRunnerGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { user } = useApp();

  const [gameState, setGameState] = useState<
    "MENU" | "PLAYING" | "PAUSED" | "GAMEOVER" | "LEVEL_COMPLETE" | "VICTORY"
  >("MENU");
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [coins, setCoins] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [leaderboard, setLeaderboard] = useState<HighScore[]>([]);
  const [playerNameInput, setPlayerNameInput] = useState<string>("");
  const [hasSubmittedScore, setHasSubmittedScore] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Audio Context ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playTone = useCallback((freq: number, type: OscillatorType, duration: number) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio might be blocked by browser policy until interaction
    }
  }, [soundEnabled]);

  // Keys ref
  const keysRef = useRef<{ left: boolean; right: boolean; jump: boolean }>({
    left: false,
    right: false,
    jump: false,
  });

  // Game internal state ref
  const gameRef = useRef<{
    player: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      width: number;
      height: number;
      grounded: boolean;
      facing: "left" | "right";
    };
    platforms: Array<{
      x: number;
      y: number;
      w: number;
      h: number;
      type: "motherboard" | "ram" | "chip" | "moving";
      vx?: number;
      minX?: number;
      maxX?: number;
    }>;
    items: Array<{
      x: number;
      y: number;
      size: number;
      type: "coin" | "ram_stick" | "chip";
      collected: boolean;
      pulse: number;
    }>;
    enemies: Array<{
      x: number;
      y: number;
      w: number;
      h: number;
      vx: number;
      minX: number;
      maxX: number;
      type: "bug" | "spike";
    }>;
    exitPortal: { x: number; y: number; w: number; h: number };
    particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      color: string;
      size: number;
    }>;
    cameraX: number;
    score: number;
    coins: number;
  }>({
    player: {
      x: 60,
      y: 300,
      vx: 0,
      vy: 0,
      width: 26,
      height: 38,
      grounded: false,
      facing: "right",
    },
    platforms: [],
    items: [],
    enemies: [],
    exitPortal: { x: 1900, y: 320, w: 40, h: 60 },
    particles: [],
    cameraX: 0,
    score: 0,
    coins: 0,
  });

  // Fetch leaderboard
  const loadLeaderboard = async () => {
    try {
      const res = await fetch("/api/game/scores");
      const data = await res.json();
      if (data.scores) {
        setLeaderboard(data.scores);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, []);

  // Initialize level
  const initLevel = useCallback((lvl: number, keepScore = false) => {
    const g = gameRef.current;
    if (!keepScore) {
      g.score = 0;
      g.coins = 0;
      setScore(0);
      setCoins(0);
    }
    g.player.x = 60;
    g.player.y = 280;
    g.player.vx = 0;
    g.player.vy = 0;
    g.cameraX = 0;
    g.particles = [];

    // Levels definitions
    if (lvl === 1) {
      // Level 1: Motherboard Express
      g.platforms = [
        // Ground floor
        { x: 0, y: 400, w: 500, h: 50, type: "motherboard" },
        { x: 580, y: 400, w: 450, h: 50, type: "motherboard" },
        { x: 1100, y: 400, w: 900, h: 50, type: "motherboard" },
        // Elevated RAM sticks and chips
        { x: 180, y: 320, w: 100, h: 18, type: "ram" },
        { x: 340, y: 260, w: 90, h: 22, type: "chip" },
        { x: 490, y: 210, w: 80, h: 18, type: "ram" },
        { x: 670, y: 270, w: 120, h: 22, type: "chip" },
        { x: 860, y: 310, w: 110, h: 18, type: "ram" },
        { x: 1040, y: 240, w: 80, h: 18, type: "ram" },
        // Moving data packet platform
        { x: 1180, y: 280, w: 90, h: 18, type: "moving", vx: 2, minX: 1150, maxX: 1350 },
        { x: 1420, y: 310, w: 120, h: 22, type: "chip" },
        { x: 1600, y: 250, w: 100, h: 18, type: "ram" },
        { x: 1770, y: 330, w: 180, h: 30, type: "motherboard" },
      ];

      g.items = [
        { x: 220, y: 285, size: 14, type: "coin", collected: false, pulse: 0 },
        { x: 385, y: 225, size: 18, type: "ram_stick", collected: false, pulse: 0 },
        { x: 530, y: 175, size: 18, type: "chip", collected: false, pulse: 0 },
        { x: 730, y: 235, size: 14, type: "coin", collected: false, pulse: 0 },
        { x: 915, y: 275, size: 18, type: "ram_stick", collected: false, pulse: 0 },
        { x: 1220, y: 245, size: 14, type: "coin", collected: false, pulse: 0 },
        { x: 1480, y: 275, size: 18, type: "chip", collected: false, pulse: 0 },
        { x: 1650, y: 215, size: 18, type: "ram_stick", collected: false, pulse: 0 },
      ];

      g.enemies = [
        { x: 300, y: 375, w: 24, h: 25, vx: 1.5, minX: 250, maxX: 460, type: "bug" },
        { x: 750, y: 375, w: 24, h: 25, vx: 1.8, minX: 680, maxX: 950, type: "bug" },
        { x: 520, y: 395, w: 40, h: 15, vx: 0, minX: 520, maxX: 520, type: "spike" },
        { x: 1300, y: 375, w: 24, h: 25, vx: 2, minX: 1250, maxX: 1550, type: "bug" },
      ];

      g.exitPortal = { x: 1870, y: 320, w: 45, h: 70 };
    } else if (lvl === 2) {
      // Level 2: GPU Overclock Core
      g.platforms = [
        { x: 0, y: 400, w: 350, h: 50, type: "motherboard" },
        { x: 420, y: 360, w: 100, h: 18, type: "ram" },
        { x: 590, y: 300, w: 110, h: 22, type: "chip" },
        { x: 770, y: 240, w: 90, h: 18, type: "moving", vx: 2.5, minX: 740, maxX: 980 },
        { x: 1050, y: 320, w: 140, h: 22, type: "chip" },
        { x: 1250, y: 260, w: 100, h: 18, type: "ram" },
        { x: 1420, y: 220, w: 90, h: 18, type: "moving", vx: -2, minX: 1380, maxX: 1580 },
        { x: 1650, y: 280, w: 120, h: 22, type: "chip" },
        { x: 1830, y: 380, w: 300, h: 40, type: "motherboard" },
      ];

      g.items = [
        { x: 200, y: 365, size: 14, type: "coin", collected: false, pulse: 0 },
        { x: 470, y: 325, size: 18, type: "ram_stick", collected: false, pulse: 0 },
        { x: 645, y: 265, size: 18, type: "chip", collected: false, pulse: 0 },
        { x: 1120, y: 285, size: 18, type: "ram_stick", collected: false, pulse: 0 },
        { x: 1300, y: 225, size: 18, type: "chip", collected: false, pulse: 0 },
        { x: 1710, y: 245, size: 18, type: "chip", collected: false, pulse: 0 },
      ];

      g.enemies = [
        { x: 160, y: 375, w: 24, h: 25, vx: 2, minX: 100, maxX: 300, type: "bug" },
        { x: 610, y: 275, w: 24, h: 25, vx: 1.2, minX: 590, maxX: 680, type: "bug" },
        { x: 1090, y: 295, w: 24, h: 25, vx: 1.5, minX: 1050, maxX: 1170, type: "bug" },
        { x: 1670, y: 255, w: 24, h: 25, vx: 1.8, minX: 1650, maxX: 1750, type: "bug" },
      ];

      g.exitPortal = { x: 1980, y: 300, w: 45, h: 70 };
    } else {
      // Level 3: Quantum Silicon Matrix (Boss level)
      g.platforms = [
        { x: 0, y: 400, w: 300, h: 50, type: "motherboard" },
        { x: 380, y: 330, w: 90, h: 18, type: "moving", vx: 3, minX: 350, maxX: 550 },
        { x: 630, y: 270, w: 100, h: 22, type: "chip" },
        { x: 800, y: 210, w: 80, h: 18, type: "ram" },
        { x: 960, y: 260, w: 90, h: 18, type: "moving", vx: 2, minX: 920, maxX: 1100 },
        { x: 1180, y: 310, w: 120, h: 22, type: "chip" },
        { x: 1380, y: 240, w: 80, h: 18, type: "ram" },
        { x: 1540, y: 200, w: 100, h: 22, type: "chip" },
        { x: 1720, y: 280, w: 90, h: 18, type: "moving", vx: -2.5, minX: 1680, maxX: 1880 },
        { x: 1950, y: 360, w: 350, h: 50, type: "motherboard" },
      ];

      g.items = [
        { x: 150, y: 365, size: 14, type: "coin", collected: false, pulse: 0 },
        { x: 680, y: 235, size: 18, type: "chip", collected: false, pulse: 0 },
        { x: 840, y: 175, size: 18, type: "ram_stick", collected: false, pulse: 0 },
        { x: 1240, y: 275, size: 18, type: "chip", collected: false, pulse: 0 },
        { x: 1420, y: 205, size: 18, type: "ram_stick", collected: false, pulse: 0 },
        { x: 1590, y: 165, size: 20, type: "chip", collected: false, pulse: 0 },
      ];

      g.enemies = [
        { x: 650, y: 245, w: 24, h: 25, vx: 2, minX: 630, maxX: 710, type: "bug" },
        { x: 1200, y: 285, w: 24, h: 25, vx: 2.2, minX: 1180, maxX: 1280, type: "bug" },
        { x: 1560, y: 175, w: 24, h: 25, vx: 2, minX: 1540, maxX: 1620, type: "bug" },
      ];

      g.exitPortal = { x: 2150, y: 280, w: 50, h: 75 };
    }
  }, []);

  // Start game handler
  const startGame = () => {
    setCurrentLevel(1);
    initLevel(1, false);
    setGameState("PLAYING");
    setHasSubmittedScore(false);
    playTone(520, "sine", 0.15);
  };

  // Next level
  const startNextLevel = () => {
    const next = currentLevel + 1;
    setCurrentLevel(next);
    initLevel(next, true);
    setGameState("PLAYING");
    playTone(660, "sine", 0.2);
  };

  // Submit high score to database
  const submitScore = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const name = playerNameInput.trim() || user?.name || "بازیکن دیجیتالیست";
      const res = await fetch("/api/game/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerName: name,
          score,
          levelReached: currentLevel,
          coinsCollected: coins,
        }),
      });

      if (res.ok) {
        setHasSubmittedScore(true);
        loadLeaderboard();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
        // Prevent window scrolling while playing
        if (gameState === "PLAYING") e.preventDefault();
      }

      if (e.code === "ArrowLeft" || e.code === "KeyA") {
        keysRef.current.left = true;
      }
      if (e.code === "ArrowRight" || e.code === "KeyD") {
        keysRef.current.right = true;
      }
      if (e.code === "ArrowUp" || e.code === "Space" || e.code === "KeyW") {
        keysRef.current.jump = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft" || e.code === "KeyA") {
        keysRef.current.left = false;
      }
      if (e.code === "ArrowRight" || e.code === "KeyD") {
        keysRef.current.right = false;
      }
      if (e.code === "ArrowUp" || e.code === "Space" || e.code === "KeyW") {
        keysRef.current.jump = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameState]);

  // Main Game Loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      animId = requestAnimationFrame(loop);
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const g = gameRef.current;
      const { player } = g;

      // Update if PLAYING
      if (gameState === "PLAYING") {
        // 1. Move Player
        const speed = 280; // px/s
        const gravity = 1200; // px/s^2
        const jumpForce = -520; // px/s

        if (keysRef.current.left) {
          player.vx = -speed;
          player.facing = "left";
        } else if (keysRef.current.right) {
          player.vx = speed;
          player.facing = "right";
        } else {
          player.vx *= 0.8;
        }

        // Jump
        if (keysRef.current.jump && player.grounded) {
          player.vy = jumpForce;
          player.grounded = false;
          playTone(440, "square", 0.08);

          // Particles
          for (let i = 0; i < 6; i++) {
            g.particles.push({
              x: player.x + player.width / 2,
              y: player.y + player.height,
              vx: (Math.random() - 0.5) * 80,
              vy: Math.random() * 40,
              life: 0.4,
              color: "#38bdf8",
              size: 3,
            });
          }
        }

        // Apply gravity
        player.vy += gravity * dt;

        // Move horizontally & check collisions
        player.x += player.vx * dt;

        // Moving platforms update
        g.platforms.forEach((p) => {
          if (p.type === "moving" && p.vx && p.minX && p.maxX) {
            p.x += p.vx;
            if (p.x > p.maxX || p.x < p.minX) {
              p.vx = -p.vx;
            }
          }
        });

        // Move vertically & check collisions
        player.y += player.vy * dt;
        player.grounded = false;

        // Platform collision
        g.platforms.forEach((p) => {
          // Check collision from top
          if (
            player.x + player.width > p.x &&
            player.x < p.x + p.w &&
            player.y + player.height >= p.y &&
            player.y + player.height - player.vy * dt <= p.y + 12 &&
            player.vy >= 0
          ) {
            player.y = p.y - player.height;
            player.vy = 0;
            player.grounded = true;
          }
        });

        // Fall into void (Game Over)
        if (player.y > 600) {
          setGameState("GAMEOVER");
          playTone(180, "sawtooth", 0.3);
          return;
        }

        // Camera follow
        const targetCamX = player.x - 250;
        g.cameraX += (targetCamX - g.cameraX) * 0.1;
        if (g.cameraX < 0) g.cameraX = 0;

        // Collectibles check
        g.items.forEach((item) => {
          if (!item.collected) {
            item.pulse += dt * 4;
            const dist = Math.hypot(
              player.x + player.width / 2 - item.x,
              player.y + player.height / 2 - item.y
            );
            if (dist < item.size + 16) {
              item.collected = true;
              let pts = 50;
              if (item.type === "ram_stick") pts = 120;
              if (item.type === "chip") pts = 250;
              g.score += pts;
              g.coins += 1;
              setScore(g.score);
              setCoins(g.coins);
              playTone(720 + pts, "sine", 0.1);

              // Burst particles
              for (let i = 0; i < 8; i++) {
                g.particles.push({
                  x: item.x,
                  y: item.y,
                  vx: (Math.random() - 0.5) * 150,
                  vy: (Math.random() - 0.5) * 150,
                  life: 0.5,
                  color: item.type === "chip" ? "#38bdf8" : "#fbbf24",
                  size: 3.5,
                });
              }
            }
          }
        });

        // Enemies patrol & check collision
        g.enemies.forEach((enemy) => {
          if (enemy.vx !== 0) {
            enemy.x += enemy.vx;
            if (enemy.x > enemy.maxX || enemy.x < enemy.minX) {
              enemy.vx = -enemy.vx;
            }
          }

          // Hitbox
          if (
            player.x + player.width > enemy.x &&
            player.x < enemy.x + enemy.w &&
            player.y + player.height > enemy.y &&
            player.y < enemy.y + enemy.h
          ) {
            // Player hit by enemy or spike
            setGameState("GAMEOVER");
            playTone(140, "sawtooth", 0.4);
          }
        });

        // Portal reached!
        const portal = g.exitPortal;
        if (
          player.x + player.width > portal.x &&
          player.x < portal.x + portal.w &&
          player.y + player.height > portal.y &&
          player.y < portal.y + portal.h
        ) {
          // Level completed
          g.score += 500;
          setScore(g.score);
          playTone(880, "triangle", 0.25);

          if (currentLevel >= 3) {
            setGameState("VICTORY");
            confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
          } else {
            setGameState("LEVEL_COMPLETE");
            confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
          }
        }

        // Update particles
        g.particles = g.particles.filter((p) => {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.life -= dt;
          return p.life > 0;
        });
      }

      // ================= DRAWING =================
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Cyber tech background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGrad.addColorStop(0, "#030712");
      bgGrad.addColorStop(1, "#090d16");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Circuit grid lines (parallax effect)
      ctx.save();
      ctx.translate(-g.cameraX * 0.3, 0);
      ctx.strokeStyle = "rgba(56, 189, 248, 0.08)";
      ctx.lineWidth = 1;
      for (let x = 0; x < 3000; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(3000, y);
        ctx.stroke();
      }
      ctx.restore();

      // Main world drawing (camera shifted)
      ctx.save();
      ctx.translate(-g.cameraX, 0);

      // Draw Platforms
      g.platforms.forEach((p) => {
        if (p.type === "motherboard") {
          // PCB Board Green/Slate with gold circuit traces
          ctx.fillStyle = "#0f172a";
          ctx.fillRect(p.x, p.y, p.w, p.h);
          // Top edge glowing cyan
          ctx.fillStyle = "#0284c7";
          ctx.fillRect(p.x, p.y, p.w, 4);

          // Circuit dots & bus traces
          ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(p.x + 10, p.y + 15);
          ctx.lineTo(p.x + p.w - 10, p.y + 15);
          ctx.stroke();

          // Hex screw holes
          ctx.fillStyle = "#38bdf8";
          ctx.beginPath();
          ctx.arc(p.x + 15, p.y + 25, 3, 0, Math.PI * 2);
          ctx.arc(p.x + p.w - 15, p.y + 25, 3, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === "ram") {
          // RAM Stick (dark green/blue PCB with golden contact pins)
          ctx.fillStyle = "#064e3b";
          ctx.fillRect(p.x, p.y, p.w, p.h);

          // Golden pins on bottom
          ctx.fillStyle = "#fbbf24";
          for (let pinX = p.x + 5; pinX < p.x + p.w - 5; pinX += 8) {
            ctx.fillRect(pinX, p.y + p.h - 4, 4, 4);
          }

          // Memory chips on the stick
          ctx.fillStyle = "#1e293b";
          for (let chipX = p.x + 8; chipX < p.x + p.w - 12; chipX += 20) {
            ctx.fillRect(chipX, p.y + 3, 14, 8);
          }
        } else if (p.type === "chip") {
          // CPU / Silicon Chip with metallic heatspreader
          ctx.fillStyle = "#1e293b";
          ctx.fillRect(p.x, p.y, p.w, p.h);

          ctx.fillStyle = "#334155";
          ctx.fillRect(p.x + 3, p.y + 3, p.w - 6, p.h - 6);

          // Digitalist Logo mark on the chip
          ctx.fillStyle = "#38bdf8";
          ctx.font = "bold 9px sans-serif";
          ctx.fillText("CPU", p.x + p.w / 2 - 10, p.y + p.h / 2 + 3);
        } else if (p.type === "moving") {
          // Glowing Neon Moving Data Packet Platform
          ctx.fillStyle = "#0369a1";
          ctx.fillRect(p.x, p.y, p.w, p.h);
          ctx.strokeStyle = "#38bdf8";
          ctx.lineWidth = 2;
          ctx.strokeRect(p.x, p.y, p.w, p.h);

          ctx.fillStyle = "#e0f2fe";
          ctx.font = "8px monospace";
          ctx.fillText("DATA >>", p.x + 10, p.y + 12);
        }
      });

      // Draw Collectibles
      g.items.forEach((item) => {
        if (!item.collected) {
          const floatY = item.y + Math.sin(item.pulse) * 4;

          if (item.type === "coin") {
            // Gold Bit Coin
            ctx.fillStyle = "#fbbf24";
            ctx.beginPath();
            ctx.arc(item.x, floatY, item.size, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#78350f";
            ctx.font = "bold 10px sans-serif";
            ctx.fillText("1", item.x - 3, floatY + 3.5);
          } else if (item.type === "ram_stick") {
            // RAM chip icon
            ctx.fillStyle = "#10b981";
            ctx.fillRect(item.x - 10, floatY - 8, 20, 16);
            ctx.fillStyle = "#fbbf24";
            ctx.fillRect(item.x - 8, floatY + 5, 16, 3);
          } else {
            // Glowing Diamond Core
            ctx.save();
            ctx.translate(item.x, floatY);
            ctx.rotate(item.pulse * 0.5);
            ctx.fillStyle = "#38bdf8";
            ctx.fillRect(-8, -8, 16, 16);
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 1.5;
            ctx.strokeRect(-8, -8, 16, 16);
            ctx.restore();
          }
        }
      });

      // Draw Enemies
      g.enemies.forEach((enemy) => {
        if (enemy.type === "bug") {
          // Cyber bug with glowing red eyes
          ctx.fillStyle = "#ef4444";
          ctx.beginPath();
          ctx.arc(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, enemy.w / 2, 0, Math.PI * 2);
          ctx.fill();

          // Bug eyes
          ctx.fillStyle = "#ffffff";
          const eyeOff = enemy.vx > 0 ? 3 : -3;
          ctx.beginPath();
          ctx.arc(enemy.x + enemy.w / 2 + eyeOff, enemy.y + enemy.h / 2 - 2, 3, 0, Math.PI * 2);
          ctx.fill();
        } else if (enemy.type === "spike") {
          // Red glowing glitch spike
          ctx.fillStyle = "#f43f5e";
          ctx.beginPath();
          ctx.moveTo(enemy.x, enemy.y + enemy.h);
          ctx.lineTo(enemy.x + enemy.w / 2, enemy.y);
          ctx.lineTo(enemy.x + enemy.w, enemy.y + enemy.h);
          ctx.closePath();
          ctx.fill();
        }
      });

      // Draw Exit Portal (Quantum Gateway)
      const p = g.exitPortal;
      ctx.fillStyle = "rgba(56, 189, 248, 0.25)";
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 3;
      ctx.strokeRect(p.x, p.y, p.w, p.h);

      // Portal energy wave
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.ellipse(p.x + p.w / 2, p.y + p.h / 2, p.w / 3, p.h / 2.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Portal Label
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 9px sans-serif";
      ctx.fillText("EXIT", p.x + 10, p.y - 8);

      // Draw Particles
      g.particles.forEach((part) => {
        ctx.fillStyle = part.color;
        ctx.beginPath();
        ctx.arc(part.x, part.y, part.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Player (Cyber Runner Avatar)
      ctx.save();
      // Runner body
      ctx.fillStyle = "#0284c7";
      ctx.fillRect(player.x, player.y + 10, player.width, player.height - 10);

      // Cyber runner head
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(player.x + 2, player.y, player.width - 4, 12);

      // Glowing Cyan Visor
      ctx.fillStyle = "#38bdf8";
      const visorX = player.facing === "right" ? player.x + 12 : player.x + 2;
      ctx.fillRect(visorX, player.y + 3, 10, 4);

      // Legs / feet
      ctx.fillStyle = "#38bdf8";
      ctx.fillRect(player.x + 3, player.y + player.height - 4, 6, 4);
      ctx.fillRect(player.x + player.width - 9, player.y + player.height - 4, 6, 4);

      ctx.restore();

      ctx.restore(); // Restore camera shift

      // ================= HUD OVERLAY =================
      // Score, Level, Coins
      ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
      ctx.fillRect(16, 16, 260, 46);
      ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
      ctx.strokeRect(16, 16, 260, 46);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 13px sans-serif";
      ctx.fillText(`امتیاز: ${g.score.toLocaleString("fa-IR")}`, 30, 36);

      ctx.fillStyle = "#38bdf8";
      ctx.fillText(`مرحله: ${currentLevel}`, 140, 36);

      ctx.fillStyle = "#fbbf24";
      ctx.fillText(`سکه: ${g.coins}`, 215, 36);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, currentLevel, playTone]);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
      {/* Game Header Bar */}
      <div className="w-full flex items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              بازی اختصاصی «دیجیتالیست رانر»
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              یک پلتفرمر ۲ بعدی در دنیای سخت‌افزار، مادربرد و مدارهای سیلیکونی
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={soundEnabled ? "قطع صدا" : "وصل صدا"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-sky-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {gameState !== "MENU" && (
            <button
              onClick={() => {
                setGameState("MENU");
                keysRef.current = { left: false, right: false, jump: false };
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>منوی بازی</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Canvas Viewport Wrapper */}
      <div className="relative w-full aspect-[8/5] sm:aspect-[16/9] max-h-[500px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={800}
          height={480}
          className="w-full h-full object-contain"
        />

        {/* OVERLAY: MENU */}
        {gameState === "MENU" && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" /> 2D Cyber Platformer
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">
              دیجیتالیست رانر (Digitalist Runner)
            </h1>
            <p className="max-w-md text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
              از روی بردهای مدارچاپی بپرید، حافظه‌های رم و پردازنده‌ها را جمع‌آوری کنید، از باگ‌ها و اسپایک‌های ولتاژ دوری کنید و به پورتال خروجی برسید!
            </p>

            <button
              onClick={startGame}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-sky-500/25 transition-all transform hover:scale-105 active:scale-95"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>شروع بازی</span>
            </button>

            <div className="mt-8 flex flex-wrap justify-center gap-6 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <kbd className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">←</kbd>
                <kbd className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">→</kbd> حرکت
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-3 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">Space</kbd> یا <kbd className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">↑</kbd> پرش
              </span>
              <span className="flex items-center gap-1.5 text-sky-400">
                <span>📱 پشتیبانی کامل لمسی در موبایل</span>
              </span>
            </div>
          </div>
        )}

        {/* OVERLAY: GAME OVER */}
        {gameState === "GAMEOVER" && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-200">
            <span className="text-4xl mb-2">💥</span>
            <h2 className="text-2xl font-black text-rose-500 mb-2">باختید! اتصال قطع شد!</h2>
            <p className="text-xs text-slate-300 mb-4">
              شما با یک باگ یا اسپایک مدار برخورد کردید.
            </p>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 mb-5 text-right w-full max-w-xs">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>امتیاز کسب شده:</span>
                <span className="font-bold text-sky-400">{score.toLocaleString("fa-IR")}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>مرحله رسیده:</span>
                <span className="font-bold text-white">{currentLevel}</span>
              </div>
            </div>

            {/* Score Submit */}
            {!hasSubmittedScore ? (
              <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xs mb-4">
                <input
                  type="text"
                  placeholder="نام شما برای لیدربورد"
                  defaultValue={user?.name || ""}
                  onChange={(e) => setPlayerNameInput(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 flex-1"
                />
                <button
                  onClick={submitScore}
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-sky-500 hover:bg-sky-600 text-white whitespace-nowrap transition-colors"
                >
                  {submitting ? "در حال ثبت..." : "ثبت رکورد"}
                </button>
              </div>
            ) : (
              <p className="text-xs text-emerald-400 font-bold mb-4">
                ✓ رکورد شما با موفقیت در جدول ثبت شد!
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  initLevel(currentLevel, false);
                  setGameState("PLAYING");
                }}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-md transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>تلاش مجدد</span>
              </button>
              <button
                onClick={() => setGameState("MENU")}
                className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-medium"
              >
                منوی اصلی
              </button>
            </div>
          </div>
        )}

        {/* OVERLAY: LEVEL COMPLETE */}
        {gameState === "LEVEL_COMPLETE" && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-200">
            <span className="text-4xl mb-2">⚡</span>
            <h2 className="text-2xl font-black text-sky-400 mb-2">مرحله با موفقیت به پایان رسید!</h2>
            <p className="text-xs text-slate-300 mb-4">
              شما پورتال خروجی را باز کردید و ۵۰۰ امتیاز پاداش گرفتید.
            </p>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 mb-5 text-right w-full max-w-xs">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>مجموع امتیاز:</span>
                <span className="font-bold text-sky-400">{score.toLocaleString("fa-IR")}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>سکه‌های جمع‌آوری شده:</span>
                <span className="font-bold text-amber-400">{coins}</span>
              </div>
            </div>

            <button
              onClick={startNextLevel}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-lg transition-transform hover:scale-105"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>ورود به مرحله بعدی ({currentLevel + 1})</span>
            </button>
          </div>
        )}

        {/* OVERLAY: VICTORY */}
        {gameState === "VICTORY" && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-200">
            <span className="text-5xl mb-2">🏆</span>
            <h2 className="text-2xl sm:text-3xl font-black text-amber-400 mb-2">
              تبریک! شما بازی را با موفقیت تمام کردید!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mb-4 leading-relaxed">
              شما توانستید تمام مدارهای سیلیکونی را فتح کنید و لقب «مستر هکر دیجیتالیست» را دریافت نمایید.
            </p>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 mb-5 text-right w-full max-w-xs">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>امتیاز نهایی:</span>
                <span className="font-bold text-sky-400 text-base">{score.toLocaleString("fa-IR")}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>سکه‌های کل:</span>
                <span className="font-bold text-amber-400">{coins}</span>
              </div>
            </div>

            {/* Score Submit */}
            {!hasSubmittedScore ? (
              <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xs mb-4">
                <input
                  type="text"
                  placeholder="نام قهرمان برای ثبت در تالار مشاهیر"
                  defaultValue={user?.name || ""}
                  onChange={(e) => setPlayerNameInput(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 flex-1"
                />
                <button
                  onClick={submitScore}
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 whitespace-nowrap transition-colors"
                >
                  {submitting ? "در حال ثبت..." : "ثبت در تالار"}
                </button>
              </div>
            ) : (
              <p className="text-xs text-emerald-400 font-bold mb-4">
                ✓ رکورد قهرمانی شما ثبت شد!
              </p>
            )}

            <button
              onClick={startGame}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span>شروع مجدد از مرحله ۱</span>
            </button>
          </div>
        )}
      </div>

      {/* MOBILE TOUCH CONTROLS (Only visible on touch devices or smaller screens) */}
      <div className="w-full flex items-center justify-between mt-4 px-2 select-none sm:hidden">
        {/* Left / Right Buttons */}
        <div className="flex gap-2">
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              keysRef.current.left = true;
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              keysRef.current.left = false;
            }}
            className="w-16 h-16 rounded-2xl bg-slate-800/90 active:bg-sky-600 border border-slate-700 text-white flex items-center justify-center text-xl shadow-lg active:scale-95 transition-transform"
          >
            <ArrowRight className="w-7 h-7" />
          </button>
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              keysRef.current.right = true;
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              keysRef.current.right = false;
            }}
            className="w-16 h-16 rounded-2xl bg-slate-800/90 active:bg-sky-600 border border-slate-700 text-white flex items-center justify-center text-xl shadow-lg active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-7 h-7" />
          </button>
        </div>

        {/* Jump Button */}
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            keysRef.current.jump = true;
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            keysRef.current.jump = false;
          }}
          className="w-20 h-16 rounded-2xl bg-sky-600 active:bg-sky-500 border border-sky-400/50 text-white flex flex-col items-center justify-center shadow-lg shadow-sky-600/30 active:scale-95 transition-transform"
        >
          <ArrowUp className="w-6 h-6" />
          <span className="text-[10px] font-bold">پرش</span>
        </button>
      </div>

      {/* LEADERBOARD TABLE */}
      <div className="w-full mt-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              تالار مشاهیر و رکوردهای برتر بازیکنان
            </h3>
          </div>
          <span className="text-xs text-slate-400">به‌روزرسانی خودکار</span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
                <th className="py-2.5 pr-2 font-medium">رتبه</th>
                <th className="py-2.5 font-medium">نام بازیکن</th>
                <th className="py-2.5 font-medium">امتیاز کسب شده</th>
                <th className="py-2.5 font-medium">مرحله نهایی</th>
                <th className="py-2.5 pl-2 font-medium">سکه‌ها</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {leaderboard.map((item, index) => (
                <tr
                  key={item.id}
                  className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                    index === 0 ? "font-bold text-amber-500 dark:text-amber-400" : ""
                  }`}
                >
                  <td className="py-3 pr-2 flex items-center gap-1.5">
                    {index === 0 ? (
                      <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-500 flex items-center justify-center font-bold text-[10px]">
                        ۱
                      </span>
                    ) : index === 1 ? (
                      <span className="w-5 h-5 rounded-full bg-slate-300/30 text-slate-400 flex items-center justify-center font-bold text-[10px]">
                        ۲
                      </span>
                    ) : index === 2 ? (
                      <span className="w-5 h-5 rounded-full bg-amber-700/20 text-amber-700 flex items-center justify-center font-bold text-[10px]">
                        ۳
                      </span>
                    ) : (
                      <span className="text-slate-400">{index + 1}</span>
                    )}
                  </td>
                  <td className="py-3 text-slate-800 dark:text-slate-200">
                    {item.playerName}
                  </td>
                  <td className="py-3 font-mono font-bold text-sky-600 dark:text-sky-400">
                    {item.score.toLocaleString("fa-IR")}
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-400">
                    مرحله {item.levelReached}
                  </td>
                  <td className="py-3 pl-2 text-amber-500 font-mono">
                    {item.coinsCollected}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
