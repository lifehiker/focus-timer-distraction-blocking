"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getSession } from "@/lib/storage";
import type { FocusSession } from "@/lib/types";
import { formatDate, formatDuration } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function SessionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [session, setSession] = useState<FocusSession | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const s = getSession(id);
    if (!s) router.replace("/history");
    else setSession(s);
    setMounted(true);
  }, [id, router]);

  if (!mounted || !session) return null;

  const completionRate = Math.round((session.completedRounds / session.totalRounds) * 100);
  const isCompleted = session.status === "completed";
  const duration = session.endedAt
    ? Math.round((new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime()) / 60000)
    : null;

  const stats = [
    { label: "Template", value: session.templateName },
    { label: "Date", value: formatDate(session.startedAt) },
    { label: "Status", value: isCompleted ? "Completed ✅" : "Stopped early" },
    { label: "Rounds", value: `${session.completedRounds} of ${session.totalRounds}` },
    { label: "Planned Focus", value: formatDuration(session.plannedFocusMinutes) },
    { label: "Completion Rate", value: `${completionRate}%` },
    ...(duration !== null ? [{ label: "Total Duration", value: `${duration}m` }] : []),
  ];

  return (
    <div className="page-enter min-h-[calc(100dvh-80px)]" style={{ background: "var(--bg)" }}>
      <div className="flex items-center gap-3 px-5 pt-14 pb-6">
        <button onClick={() => router.back()} style={{ color: "var(--text-muted)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>Session Details</h1>
      </div>

      <div className="px-4 pb-8">
        {/* Hero card */}
        <div
          className="rounded-3xl p-6 text-center mb-6"
          style={{
            background: isCompleted
              ? "linear-gradient(135deg, #0a1a0e 0%, #0d120a 100%)"
              : "linear-gradient(135deg, #1a0a0a 0%, #130d0d 100%)",
            border: isCompleted ? "1px solid rgba(52,211,153,0.2)" : "1px solid rgba(239,68,68,0.15)",
          }}
        >
          <div className="text-5xl mb-3">{isCompleted ? "🏆" : "⏸️"}</div>
          <Badge variant={isCompleted ? "success" : "destructive"} className="mb-2">
            {isCompleted ? "Completed" : "Stopped Early"}
          </Badge>
          <p className="text-2xl font-bold mt-2" style={{ color: "var(--text)" }}>
            {completionRate}% complete
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            {session.completedRounds} of {session.totalRounds} rounds
          </p>
        </div>

        {/* Details list */}
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="flex items-center justify-between px-4 py-3.5"
              style={{
                background: "var(--surface)",
                borderBottom: i < stats.length - 1 ? "1px solid var(--border)" : undefined,
              }}
            >
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>{stat.label}</span>
              <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
