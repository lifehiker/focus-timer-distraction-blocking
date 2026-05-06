"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSessions, getSettings } from "@/lib/storage";
import type { FocusSession, AppSettings } from "@/lib/types";
import { formatDate, formatShortDate, formatDuration, isWithin7Days } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

function groupSessionsByDate(sessions: FocusSession[]) {
  const groups: Record<string, FocusSession[]> = {};
  sessions.forEach((s) => {
    const date = new Date(s.startedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    if (!groups[date]) groups[date] = [];
    groups[date].push(s);
  });
  return groups;
}

export default function HistoryPage() {
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const allSessions = getSessions();
    const s = getSettings();
    setSettings(s);
    // Free tier: last 7 days only
    if (!s.premiumUnlocked) {
      setSessions(allSessions.filter((s) => isWithin7Days(s.startedAt)));
    } else {
      setSessions(allSessions);
    }
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const groups = groupSessionsByDate(sessions);
  const dateKeys = Object.keys(groups);

  return (
    <div className="page-enter min-h-[calc(100dvh-80px)]" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div className="px-5 pt-14 pb-6">
        <p className="text-xs font-medium tracking-widest uppercase mb-0.5" style={{ color: "var(--text-muted)" }}>Track</p>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>Session History</h1>
      </div>

      {/* Free tier notice */}
      {!settings?.premiumUnlocked && (
        <div className="mx-4 mb-4 rounded-2xl px-4 py-3 flex items-center justify-between gap-2" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)" }}>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Showing last 7 days.
          </p>
          <Link href="/paywall" className="text-xs font-semibold" style={{ color: "#f59e0b" }}>
            Upgrade for all history →
          </Link>
        </div>
      )}

      <div className="px-4 pb-6">
        {sessions.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">⏱️</p>
            <p className="font-semibold mb-2" style={{ color: "var(--text)" }}>No sessions yet</p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Complete a focus session to see it here</p>
          </div>
        ) : (
          <div className="space-y-6">
            {dateKeys.map((date) => (
              <div key={date}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>{date}</p>
                <div className="space-y-2">
                  {groups[date].map((session) => (
                    <Link key={session.id} href={`/history/${session.id}`}>
                      <div
                        className="rounded-2xl p-4 flex items-center gap-3 hover:opacity-90 active:opacity-75 transition-opacity"
                        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                      >
                        {/* Status icon */}
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                          style={{
                            background: session.status === "completed" ? "rgba(52,211,153,0.12)" : "rgba(239,68,68,0.08)",
                          }}
                        >
                          {session.status === "completed" ? "✅" : "⏸️"}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate" style={{ color: "var(--text)" }}>
                            {session.templateName}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                            {session.completedRounds}/{session.totalRounds} rounds · {formatDuration(session.plannedFocusMinutes)} focus
                          </p>
                        </div>

                        {/* Badge */}
                        <div className="flex-shrink-0">
                          <Badge variant={session.status === "completed" ? "success" : "destructive"}>
                            {session.status === "completed" ? "Done" : "Stopped"}
                          </Badge>
                        </div>

                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-muted)", flexShrink: 0 }}>
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
