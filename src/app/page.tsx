"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getDefaultTemplate, getSettings, initializeStorage } from "@/lib/storage";
import type { FocusTemplate, AppSettings } from "@/lib/types";
import { formatDuration } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  const router = useRouter();
  const [template, setTemplate] = useState<FocusTemplate | null>(null);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    initializeStorage();
    const s = getSettings();
    setSettings(s);
    setTemplate(getDefaultTemplate());
    setMounted(true);

    if (!s.hasCompletedOnboarding) {
      router.push("/onboarding");
    }
  }, [router]);

  if (!mounted || !settings?.hasCompletedOnboarding) return null;

  const totalFocusMinutes = template ? template.focusMinutes * template.rounds : 0;

  return (
    <div className="page-enter min-h-[calc(100dvh-80px)] flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div className="px-5 pt-14 pb-6">
        <p className="text-xs font-medium tracking-widest uppercase mb-1" style={{ color: "var(--text-muted)" }}>
          Focus Loop
        </p>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
          Ready to focus?
        </h1>
      </div>

      {/* Default Template Card */}
      <div className="px-4 mb-6">
        {template ? (
          <div
            className="rounded-3xl p-5 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #1a1506 0%, #12120a 100%)",
              border: "1px solid rgba(245, 158, 11, 0.2)",
            }}
          >
            {/* Glow */}
            <div
              className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20 pointer-events-none"
              style={{ background: "radial-gradient(circle, #f59e0b 0%, transparent 70%)", transform: "translate(30%, -30%)" }}
            />

            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge variant="focus" className="mb-2">Default Template</Badge>
                  <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>{template.name}</h2>
                </div>
                <Link href="/templates">
                  <Button variant="ghost" size="sm" className="text-amber-400/70 hover:text-amber-400">
                    Edit
                  </Button>
                </Link>
              </div>

              {/* Template stats */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: "Focus", value: `${template.focusMinutes}m`, color: "var(--focus)" },
                  { label: "Break", value: `${template.breakMinutes}m`, color: "var(--break)" },
                  { label: "Rounds", value: `×${template.rounds}`, color: "var(--text)" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl p-3 text-center"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <p className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{stat.label}</p>
                  </div>
                ))}
              </div>

              <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
                Total focus time: <span style={{ color: "var(--focus)" }}>{formatDuration(totalFocusMinutes)}</span>
              </p>

              <Button
                variant="focus"
                size="lg"
                className="w-full text-base"
                onClick={() => {
                  sessionStorage.setItem("active_template", JSON.stringify(template));
                  router.push("/session");
                }}
              >
                <svg className="mr-2" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Start Focus Session
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl p-6 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <p className="text-lg font-semibold mb-2" style={{ color: "var(--text)" }}>No templates yet</p>
            <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>Create a template to get started</p>
            <Link href="/templates/new">
              <Button variant="focus">Create Template</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Quick nav grid */}
      <div className="px-4 mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>Quick Access</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { href: "/templates", label: "Templates", icon: "📋", desc: "Manage loops" },
            { href: "/stats", label: "Stats", icon: "📊", desc: "Track progress" },
            { href: "/blocking", label: "Blocking", icon: "🛡️", desc: "Distraction shield" },
          ].map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className="rounded-2xl p-4 text-center hover:bg-white/5 active:bg-white/10 transition-colors cursor-pointer"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <div className="text-2xl mb-1.5">{item.icon}</div>
                <p className="text-xs font-semibold" style={{ color: "var(--text)" }}>{item.label}</p>
                <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Premium CTA (if not premium) */}
      {!settings.premiumUnlocked && (
        <div className="px-4 mb-4">
          <Link href="/paywall">
            <div
              className="rounded-2xl p-4 flex items-center gap-3 hover:opacity-90 transition-opacity"
              style={{
                background: "linear-gradient(135deg, #1a0a2e 0%, #0d0d1a 100%)",
                border: "1px solid rgba(139, 92, 246, 0.25)",
              }}
            >
              <div className="text-2xl">⚡</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>Unlock Focus Loop Pro</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Blocking, unlimited templates, full stats</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-muted)", flexShrink: 0 }}>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
