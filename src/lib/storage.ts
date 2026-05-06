import type { FocusTemplate, FocusSession, AppSettings } from "./types";
import { generateId } from "./utils";

const isClient = typeof window !== "undefined";

const KEYS = {
  TEMPLATES: "focus_templates",
  SESSIONS: "focus_sessions",
  SETTINGS: "focus_settings",
} as const;

const DEFAULT_TEMPLATE: FocusTemplate = {
  id: "default-template",
  name: "Classic Pomodoro",
  focusMinutes: 25,
  breakMinutes: 5,
  rounds: 4,
  isDefault: true,
  createdAt: new Date().toISOString(),
};

const DEFAULT_SETTINGS: AppSettings = {
  id: "settings",
  hasCompletedOnboarding: false,
  notificationsEnabled: false,
  blockingEnabled: false,
  premiumUnlocked: false,
  activeBlockingPresets: [],
};

function read<T>(key: string): T | null {
  if (!isClient) return null;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function write<T>(key: string, value: T): void {
  if (!isClient) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable
  }
}

// Templates
export function getTemplates(): FocusTemplate[] {
  const templates = read<FocusTemplate[]>(KEYS.TEMPLATES);
  if (!templates || templates.length === 0) {
    const defaults = [DEFAULT_TEMPLATE];
    write(KEYS.TEMPLATES, defaults);
    return defaults;
  }
  return templates;
}

export function saveTemplate(template: FocusTemplate): void {
  const templates = getTemplates();
  const idx = templates.findIndex((t) => t.id === template.id);
  if (idx >= 0) {
    templates[idx] = template;
  } else {
    templates.push(template);
  }
  write(KEYS.TEMPLATES, templates);
}

export function deleteTemplate(id: string): void {
  const templates = getTemplates().filter((t) => t.id !== id);
  write(KEYS.TEMPLATES, templates);
}

export function setDefaultTemplate(id: string): void {
  const templates = getTemplates().map((t) => ({ ...t, isDefault: t.id === id }));
  write(KEYS.TEMPLATES, templates);
}

export function duplicateTemplate(id: string): FocusTemplate | null {
  const templates = getTemplates();
  const original = templates.find((t) => t.id === id);
  if (!original) return null;
  const copy: FocusTemplate = {
    ...original,
    id: generateId(),
    name: `${original.name} (copy)`,
    isDefault: false,
    createdAt: new Date().toISOString(),
  };
  templates.push(copy);
  write(KEYS.TEMPLATES, templates);
  return copy;
}

export function getDefaultTemplate(): FocusTemplate | null {
  const templates = getTemplates();
  return templates.find((t) => t.isDefault) || templates[0] || null;
}

// Sessions
export function getSessions(): FocusSession[] {
  return read<FocusSession[]>(KEYS.SESSIONS) || [];
}

export function saveSession(session: FocusSession): void {
  const sessions = getSessions();
  const idx = sessions.findIndex((s) => s.id === session.id);
  if (idx >= 0) {
    sessions[idx] = session;
  } else {
    sessions.unshift(session);
  }
  write(KEYS.SESSIONS, sessions);
}

export function getSession(id: string): FocusSession | null {
  return getSessions().find((s) => s.id === id) || null;
}

// Settings
export function getSettings(): AppSettings {
  return read<AppSettings>(KEYS.SETTINGS) || { ...DEFAULT_SETTINGS };
}

export function saveSettings(settings: Partial<AppSettings>): AppSettings {
  const current = getSettings();
  const updated = { ...current, ...settings };
  write(KEYS.SETTINGS, updated);
  return updated;
}

export function initializeStorage(): void {
  if (!isClient) return;
  // Ensure default template exists
  getTemplates();
  // Ensure settings exist
  if (!read(KEYS.SETTINGS)) {
    write(KEYS.SETTINGS, DEFAULT_SETTINGS);
  }
}
