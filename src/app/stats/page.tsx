"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSessions, getTemplates, getSettings } from "@/lib/storage";
import type { FocusSession, FocusTemplate, AppSettings } from "@/lib/types";
import { isThisWeek, formatDuration } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface TemplateStats {
  id: string;
  name: string;
  totalSessions: number;
  completedSessions: number;
  completionRate: number;
  totalFocusMinutes: number;
}

function computeStats(sessions: FocusSession[], templates: FocusTemplate[]) {
  const thisWeek = sessions.filter((s) => isThisWeek(s.startedAt));
  const weekCompleted = thisWeek.filter((s) => s.status === "completed").length;
  const weekFocusMinutes = thisWeek
    .filter((s) => s.status === "completed")
    .reduce((acc, s) => acc + s.completedRounds * (s.plannedFocusMinutes / s.totalRounds), 0);

  // Template stats
  const templateMap: Record<string, TemplateStats> = {};
  sessions.forEach((s) => {
    const key = s.templateName;
    if (!templateMap[key]) {
      templateMap[key] = {
        id: s.templateId || key,
        name: key,
        totalSessions: 0,
        completedSessions: 0,
        completionRate: 0,
        totalFocusMinutes: 0,
      };
    }
    templateMap[key].totalSessions++;
    if (s.status === "completed") {
      templateMap[key].completedSessions++;
      templateMap[key].totalFocusMinutes += s.plannedFocusMinutes;
    }
  });

  const templateStats = Object.values(templateMap)
    .map((t) => ({
      ...t,
      completionRate: t.totalSessions > 0 ? Math.round((t.completedSessions / t.totalSessions) * 100) : 0,
    }))
    .sort((a, b) => b.completionRate - a.completionRate);

  const mostUsed = Object.values(templateMap).sort((a, b) => b.totalSessions - a.totalSessions)[0] || null;

  // Weekly day breakdown
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayMinutes = days.map((_, i) => {
    const dayStart = new Date();
    const dayOfWeek = dayStart.getDay();
    const diff = (i + 1) - (dayOfWeek === 0 ? 7 : dayOfWeek);
    const target = new Date(dayStart);
    target.setDate(target.getDate() + diff);
    target.setHours(0, 0, 0, 0);
    const targetEnd = new Date(target);
    targetEnd.setHours(23, 59, 59, 999);

    return sessions
      .filter((s) => {
        const d = new Date(s.startedAt);
        return d >= target && d <= targetEnd && s.status === "completed";
      })
      .reduce((acc, s) => acc + s.completedRounds * (s.plannedFocusMinutes / s.totalRounds), 0);
  });

  return { weekCompleted, weekFocusMinutes: Math.round(weekFocusMinutes), templateStats, mostUsed, dayMinutes, days };
}

export default function StatsPage() {
  const [stats, setStats] = useState<ReturnType<typeof computeStats> | null>(null);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const sessions = getSessions();
    const templates = getTemplates();
    const s = getSettings();
    setSettings(s);
    setStats(computeStats(sessions, templates));
    setMounted(true);
  }, []);

  if (!mounted || !stats) return null;

  const isPremium = settings?.premiumUnlocked ?? false;
  const maxBarMinutes = Math.max(...stats.dayMinutes, 60);

  return (
    <div className="page-enter min-h-[calc(100dvh-80px)]" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div className="px-5 pt-14 pb-4">
        <p className="text-xs font-medium tracking-widest uppercase mb-0.5" style={{ color: "var(--text-muted)" }}>Insights</p>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>Stats</h1>
      </div>

      <div className="px-4 space-y-4 pb-8">
        {/* This week summary */}
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              label: "Sessions this week",
              value: stats.weekCompleted,
              suffix: "",
              color: "#f59e0b",
              bg: "rgba(245,158,11,0.08)",
              border: "rgba(245,158,11,0.15)",
              icon: "🎯",
            },
            {
              label: "Focus minutes",
              value: stats.weekFocusMinutes,
              suffix: "m",
              color: "#34d399",
              bg: "rgba(52,211,153,0.08)",
              border: "rgba(52,211,153,0.15)",
              icon: "⏱️",
            },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-2xl p-4"
              style={{ background: card.bg, border: `1px solid ${card.border}` }}
            >
              <p className="text-2xl mb-1">{card.icon}</p>
              <p className="text-3xl font-bold" style={{ color: card.color }}>
                {card.value}{card.suffix}
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{card.label}</p>
            </div>
          ))}
        </div>

        {/* Weekly bar chart */}
        <div
          className="rounded-2xl p-4"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <p className="text-sm font-semibold mb-4" style={{ color: "var(--text)" }}>This Week</p>
          <div className="flex items-end justify-between gap-2" style={{ height: "100px" }}>
            {stats.days.map((day, i) => {
              const minutes = stats.dayMinutes[i];
              const height = maxBarMinutes > 0 ? Math.round((minutes / maxBarMinutes) * 100) : 0;
              const isToday = new Date().toLocaleDateString("en-US", { weekday: "short" }).slice(0, 3) === day;
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end justify-center" style={{ height: "80px" }}>
                    <div
                      className="w-full rounded-lg transition-all duration-500"
                      style={{
                        height: `${Math.max(height, minutes > 0 ? 8 : 3)}%`,
                        background: minutes > 0
                          ? isToday ? "#f59e0b" : "rgba(245,158,11,0.5)"
                          : "rgba(255,255,255,0.05)",
                        minHeight: "3px",
                      }}
                    />
                  </div>
                  <p
                    className="text-[10px] font-medium"
                    style={{ color: isToday ? "#f59e0b" : "var(--text-muted)" }}
                  >
                    {day}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Most used template */}
        {stats.mostUsed && (
          <div
            className="rounded-2xl p-4"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>Most Used Template</p>
              <Badge variant="focus">⭐ Favorite</Badge>
            </div>
            <p className="text-xl font-bold mt-2" style={{ color: "#f59e0b" }}>{stats.mostUsed.name}</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              {stats.mostUsed.totalSessions} sessions · {stats.mostUsed.completionRate}% completion
            </p>
          </div>
        )}

        {/* Template comparison */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>Template Comparison</p>
            {!isPremium && (
              <Link href="/paywall">
                <span className="text-xs font-medium" style={{ color: "#a78bfa" }}>Unlock Pro →</span>
              </Link>
            )}
          </div>

          {stats.templateStats.length === 0 ? (
            <div className="rounded-2xl p-6 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Complete sessions to see comparison stats</p>
            </div>
          ) : (
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                border: "1px solid var(--border)",
                filter: !isPremium ? "blur(3px)" : undefined,
                pointerEvents: !isPremium ? "none" : undefined,
              }}
            >
              {stats.templateStats.map((t, i) => (
                <div
                  key={t.id}
                  className="px-4 py-3 flex items-center gap-3"
                  style={{
                    background: "var(--surface)",
                    borderBottom: i < stats.templateStats.length - 1 ? "1px solid var(--border)" : undefined,
                  }}
                >
                  <span className="text-sm font-bold w-6 text-center" style={{ color: "var(--text-muted)" }}>
                    #{i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>{t.name}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{t.totalSessions} sessions</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold" style={{ color: t.completionRate >= 75 ? "#34d399" : t.completionRate >= 50 ? "#f59e0b" : "#f87171" }}>
                      {t.completionRate}%
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>completion</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isPremium && stats.templateStats.length > 0 && (
            <div className="mt-2 text-center">
              <Link href="/paywall">
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Unlock Pro to see template comparison insights
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
