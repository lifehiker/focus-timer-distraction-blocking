"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { FocusTemplate, TimerPhase, TimerState, FocusSession } from "@/lib/types";
import { generateId } from "@/lib/utils";
import * as storage from "@/lib/storage";

function createInitialState(): TimerState {
  return {
    phase: "idle",
    secondsRemaining: 0,
    currentRound: 1,
    totalRounds: 0,
    isRunning: false,
    isPaused: false,
    template: null,
    sessionId: null,
    startedAt: null,
    completedRounds: 0,
  };
}

export function useTimer() {
  const [state, setState] = useState<TimerState>(createInitialState);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const fireNotification = useCallback((title: string, body: string) => {
    if (typeof window === "undefined") return;
    const settings = storage.getSettings();
    if (!settings.notificationsEnabled) return;
    if (Notification.permission === "granted") {
      new Notification(title, { body, icon: "/favicon.ico" });
    }
  }, []);

  const advancePhase = useCallback(() => {
    const s = stateRef.current;
    if (!s.template) return;

    if (s.phase === "focus") {
      const newCompleted = s.completedRounds + 1;
      if (newCompleted >= s.totalRounds) {
        // Session complete
        clearTimer();
        fireNotification("Session Complete! 🎉", `You finished all ${s.totalRounds} rounds. Great work!`);
        const session: FocusSession = {
          id: s.sessionId!,
          templateName: s.template.name,
          templateId: s.template.id,
          startedAt: s.startedAt!,
          endedAt: new Date().toISOString(),
          plannedFocusMinutes: s.template.focusMinutes * s.totalRounds,
          completedRounds: newCompleted,
          totalRounds: s.totalRounds,
          status: "completed",
        };
        storage.saveSession(session);
        setState((prev) => ({
          ...prev,
          phase: "completed",
          isRunning: false,
          completedRounds: newCompleted,
        }));
      } else {
        // Start break
        fireNotification("Break Time! ☕", `Round ${newCompleted} done. Take a ${s.template.breakMinutes} min break.`);
        setState((prev) => ({
          ...prev,
          phase: "break",
          secondsRemaining: prev.template!.breakMinutes * 60,
          completedRounds: newCompleted,
        }));
      }
    } else if (s.phase === "break") {
      // Start next focus round
      fireNotification("Focus Time! 🎯", `Round ${s.completedRounds + 1} of ${s.totalRounds}. Let's go!`);
      setState((prev) => ({
        ...prev,
        phase: "focus",
        secondsRemaining: prev.template!.focusMinutes * 60,
        currentRound: prev.completedRounds + 1,
      }));
    }
  }, [clearTimer, fireNotification]);

  useEffect(() => {
    if (state.isRunning && !state.isPaused && state.phase !== "completed" && state.phase !== "idle") {
      intervalRef.current = setInterval(() => {
        setState((prev) => {
          if (prev.secondsRemaining <= 1) {
            return { ...prev, secondsRemaining: 0 };
          }
          return { ...prev, secondsRemaining: prev.secondsRemaining - 1 };
        });
      }, 1000);
    } else {
      clearTimer();
    }
    return clearTimer;
  }, [state.isRunning, state.isPaused, state.phase, clearTimer]);

  useEffect(() => {
    if (state.secondsRemaining === 0 && state.isRunning && !state.isPaused &&
        (state.phase === "focus" || state.phase === "break")) {
      advancePhase();
    }
  }, [state.secondsRemaining, state.isRunning, state.isPaused, state.phase, advancePhase]);

  const start = useCallback((template: FocusTemplate) => {
    clearTimer();
    const sessionId = generateId();
    setState({
      phase: "focus",
      secondsRemaining: template.focusMinutes * 60,
      currentRound: 1,
      totalRounds: template.rounds,
      isRunning: true,
      isPaused: false,
      template,
      sessionId,
      startedAt: new Date().toISOString(),
      completedRounds: 0,
    });
  }, [clearTimer]);

  const pause = useCallback(() => {
    setState((prev) => ({ ...prev, isPaused: true }));
  }, []);

  const resume = useCallback(() => {
    setState((prev) => ({ ...prev, isPaused: false }));
  }, []);

  const skip = useCallback(() => {
    clearTimer();
    advancePhase();
  }, [clearTimer, advancePhase]);

  const stop = useCallback(() => {
    const s = stateRef.current;
    clearTimer();
    if (s.sessionId && s.template && s.startedAt) {
      const session: FocusSession = {
        id: s.sessionId,
        templateName: s.template.name,
        templateId: s.template.id,
        startedAt: s.startedAt,
        endedAt: new Date().toISOString(),
        plannedFocusMinutes: s.template.focusMinutes * s.totalRounds,
        completedRounds: s.completedRounds,
        totalRounds: s.totalRounds,
        status: "stopped",
      };
      storage.saveSession(session);
    }
    setState(createInitialState());
  }, [clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    setState(createInitialState());
  }, [clearTimer]);

  const totalSeconds =
    state.phase === "focus"
      ? (state.template?.focusMinutes || 0) * 60
      : state.phase === "break"
      ? (state.template?.breakMinutes || 0) * 60
      : 0;

  const progress = totalSeconds > 0 ? 1 - state.secondsRemaining / totalSeconds : 0;

  return { state, start, pause, resume, skip, stop, reset, progress, totalSeconds };
}
