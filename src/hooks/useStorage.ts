"use client";

import { useState, useEffect, useCallback } from "react";
import * as storage from "@/lib/storage";
import type { FocusTemplate, FocusSession, AppSettings } from "@/lib/types";

export function useTemplates() {
  const [templates, setTemplates] = useState<FocusTemplate[]>([]);

  const refresh = useCallback(() => {
    setTemplates(storage.getTemplates());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const save = useCallback(
    (template: FocusTemplate) => {
      storage.saveTemplate(template);
      refresh();
    },
    [refresh]
  );

  const remove = useCallback(
    (id: string) => {
      storage.deleteTemplate(id);
      refresh();
    },
    [refresh]
  );

  const setDefault = useCallback(
    (id: string) => {
      storage.setDefaultTemplate(id);
      refresh();
    },
    [refresh]
  );

  const duplicate = useCallback(
    (id: string) => {
      storage.duplicateTemplate(id);
      refresh();
    },
    [refresh]
  );

  return { templates, save, remove, setDefault, duplicate, refresh };
}

export function useSessions() {
  const [sessions, setSessions] = useState<FocusSession[]>([]);

  const refresh = useCallback(() => {
    setSessions(storage.getSessions());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const save = useCallback(
    (session: FocusSession) => {
      storage.saveSession(session);
      refresh();
    },
    [refresh]
  );

  return { sessions, save, refresh };
}

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings | null>(null);

  useEffect(() => {
    setSettings(storage.getSettings());
  }, []);

  const update = useCallback((partial: Partial<AppSettings>) => {
    const updated = storage.saveSettings(partial);
    setSettings(updated);
    return updated;
  }, []);

  return { settings, update };
}
