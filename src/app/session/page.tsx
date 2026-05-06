"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { FocusTemplate } from "@/lib/types";
import { useTimer } from "@/hooks/useTimer";
import { formatTime } from "@/lib/utils";
import { getSettings } from "@/lib/storage";

const RING_RADIUS = 110;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function TimerRing({ progress, phase }: { progress: number; phase: string }) {
  const dashOffset = RING_CIRCUMFERENCE * (1 - progress);
  const color = phase === "break" ? "#34d399" : "#f59e0b";
  const glowColor = phase === "break" ? "rgba(52,211,153,0.3)" : "rgba(245,158,11,0.3)";

  return (
    <svg width="260" height="260" viewBox="0 0 260 260" className="absolute inset-0">
      {/* Track */}
      <circle
        cx="130" cy="130" r={RING_RADIUS}
        fill="none"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth="10"
      />
      {/* Progress */}
      <circle
        cx="130" cy="130" r={RING_RADIUS}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={RING_CIRCUMFERENCE}
        strokeDashoffset={dashOffset}
        transform="rotate(-90 130 130)"
        style={{
          transition: "stroke-dashoffset 0.5s ease, stroke 0.5s ease",
          filter: `drop-shadow(0 0 8px ${glowColor})`,
        }}
      />
    </svg>
  );
}

export default function SessionPage() {
  const router = useRouter();
  const { state, start, pause, resume, skip, stop, progress } = useTimer();
  const [template, setTemplate] = useState<FocusTemplate | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showStopConfirm, setShowStopConfirm] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = sessionStorage.getItem("active_template");
    if (stored) {
      try {
        const t = JSON.parse(stored) as FocusTemplate;
        setTemplate(t);
        start(t);
      } catch {
        router.replace("/");
      }
    } else {
      router.replace("/");
    }
  }, [router, start]);

  // Handle browser notification permission
  useEffect(() => {
    if (typeof window !== "undefined") {
      const settings = getSettings();
      if (settings.notificationsEnabled && Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, []);

  const handleStop = useCallback(() => {
    if (state.completedRounds > 0 || state.currentRound > 1) {
      setShowStopConfirm(true);
    } else {
      stop();
      router.push("/");
    }
  }, [state.completedRounds, state.currentRound, stop, router]);

  const confirmStop = useCallback(() => {
    stop();
    router.push("/");
  }, [stop, router]);

  useEffect(() => {
    if (state.phase === "completed") {
      // After a brief delay, show completion screen
    }
  }, [state.phase]);

  if (!mounted) return null;

  const isFocus = state.phase === "focus";
  const isBreak = state.phase === "break";
  const isCompleted = state.phase === "completed";

  const phaseColor = isBreak ? "#34d399" : "#f59e0b";
  const bgGradient = isBreak
    ? "radial-gradient(ellipse at 50% 30%, rgba(52,211,153,0.08) 0%, transparent 60%)"
    : isCompleted
    ? "radial-gradient(ellipse at 50% 30%, rgba(139,92,246,0.1) 0%, transparent 60%)"
    : "radial-gradient(ellipse at 50% 30%, rgba(245,158,11,0.08) 0%, transparent 60%)";

  return (
    <div
      className="min-h-dvh flex flex-col"
      style={{ background: `var(--bg)`, position: "relative" }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: bgGradient, transition: "background 1s ease" }}
      />

      <div className="relative z-10 flex flex-col min-h-dvh">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 pt-14 pb-4">
          <button
            onClick={handleStop}
            className="flex items-center gap-1.5 text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Stop
          </button>

          <div className="text-center">
            <p className="text-xs font-medium tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>
              {template?.name || "Session"}
            </p>
          </div>

          <div style={{ width: "50px" }} />
        </div>

        {/* Phase label */}
        <div className="text-center px-5 mb-2">
          {isCompleted ? (
            <span className="text-base font-semibold px-4 py-1.5 rounded-full" style={{ background: "rgba(139,92,246,0.15)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.3)" }}>
              Session Complete! 🎉
            </span>
          ) : (
            <span className="text-base font-semibold px-4 py-1.5 rounded-full" style={{
              background: isBreak ? "rgba(52,211,153,0.12)" : "rgba(245,158,11,0.12)",
              color: phaseColor,
              border: `1px solid ${isBreak ? "rgba(52,211,153,0.25)" : "rgba(245,158,11,0.25)"}`,
            }}>
              {isBreak ? "☕ Break" : "🎯 Focus"}
            </span>
          )}
        </div>

        {/* Timer display */}
        <div className="flex-1 flex flex-col items-center justify-center px-5">
          <div className="relative w-[260px] h-[260px] flex items-center justify-center mb-8">
            {!isCompleted && (
              <TimerRing progress={progress} phase={state.phase} />
            )}
            {isCompleted ? (
              <div className="text-center">
                <div className="text-7xl mb-2">🏆</div>
                <p className="text-xl font-bold" style={{ color: "var(--text)" }}>Done!</p>
              </div>
            ) : (
              <div className="text-center relative z-10">
                <p
                  className="timer-digit font-bold tabular-nums"
                  style={{
                    fontSize: "clamp(52px, 12vw, 68px)",
                    color: "var(--text)",
                    lineHeight: 1,
                    letterSpacing: "-2px",
                  }}
                >
                  {formatTime(state.secondsRemaining)}
                </p>
                {state.isPaused && (
                  <p className="text-xs mt-2 font-medium" style={{ color: "var(--text-muted)" }}>PAUSED</p>
                )}
              </div>
            )}
          </div>

          {/* Round indicator */}
          <div className="flex items-center gap-3 mb-8">
            {Array.from({ length: state.totalRounds }).map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i < state.completedRounds ? "24px" : "8px",
                  height: "8px",
                  background: i < state.completedRounds
                    ? "#f59e0b"
                    : i === state.completedRounds
                    ? "rgba(245,158,11,0.4)"
                    : "rgba(255,255,255,0.1)",
                }}
              />
            ))}
          </div>

          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {isCompleted
              ? `Completed ${state.completedRounds} of ${state.totalRounds} rounds`
              : `Round ${state.completedRounds + (isBreak ? 0 : 1)} of ${state.totalRounds}`}
          </p>
        </div>

        {/* Controls */}
        <div className="px-5 pb-10">
          {isCompleted ? (
            <button
              onClick={() => router.push("/")}
              className="w-full h-14 rounded-2xl font-semibold text-base text-black"
              style={{ background: "#a78bfa" }}
            >
              Back to Home
            </button>
          ) : (
            <div className="flex items-center gap-3">
              {/* Skip */}
              <button
                onClick={skip}
                className="flex-1 h-14 rounded-2xl font-medium text-sm flex items-center justify-center gap-2"
                style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 4 15 12 5 20 5 4" />
                  <line x1="19" y1="5" x2="19" y2="19" />
                </svg>
                Skip
              </button>

              {/* Pause/Resume */}
              <button
                onClick={state.isPaused ? resume : pause}
                className="flex-[2] h-14 rounded-2xl font-semibold text-base flex items-center justify-center gap-2"
                style={{
                  background: isBreak ? "#34d399" : "#f59e0b",
                  color: "black",
                }}
              >
                {state.isPaused ? (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    Resume
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="4" width="4" height="16" />
                      <rect x="14" y="4" width="4" height="16" />
                    </svg>
                    Pause
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stop confirmation overlay */}
      {showStopConfirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-sm rounded-3xl p-6" style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
            <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text)" }}>Stop session?</h3>
            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
              You've completed {state.completedRounds} of {state.totalRounds} rounds. Your progress will be saved.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowStopConfirm(false)}
                className="flex-1 h-12 rounded-2xl font-medium"
                style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
              >
                Keep Going
              </button>
              <button
                onClick={confirmStop}
                className="flex-1 h-12 rounded-2xl font-semibold"
                style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171" }}
              >
                Stop & Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
