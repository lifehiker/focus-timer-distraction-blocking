export interface FocusTemplate {
  id: string;
  name: string;
  focusMinutes: number;
  breakMinutes: number;
  rounds: number;
  isDefault: boolean;
  createdAt: string;
}

export interface FocusSession {
  id: string;
  templateName: string;
  templateId?: string;
  startedAt: string;
  endedAt?: string;
  plannedFocusMinutes: number;
  completedRounds: number;
  totalRounds: number;
  status: "completed" | "stopped";
}

export interface AppSettings {
  id: string;
  hasCompletedOnboarding: boolean;
  notificationsEnabled: boolean;
  blockingEnabled: boolean;
  premiumUnlocked: boolean;
  activeBlockingPresets: string[];
}

export interface BlockingPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  domains: string[];
}

export type TimerPhase = "focus" | "break" | "completed" | "idle";

export interface TimerState {
  phase: TimerPhase;
  secondsRemaining: number;
  currentRound: number;
  totalRounds: number;
  isRunning: boolean;
  isPaused: boolean;
  template: FocusTemplate | null;
  sessionId: string | null;
  startedAt: string | null;
  completedRounds: number;
}
