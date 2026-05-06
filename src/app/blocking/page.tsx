"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSettings, saveSettings } from "@/lib/storage";
import { BLOCKING_PRESETS, PRESET_BUNDLES } from "@/lib/blocking-presets";
import type { AppSettings } from "@/lib/types";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function BlockingPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setSettings(getSettings());
    setMounted(true);
  }, []);

  if (!mounted || !settings) return null;

  const isPremium = settings.premiumUnlocked;

  const togglePreset = (id: string) => {
    if (!isPremium) return;
    const current = settings.activeBlockingPresets || [];
    const updated = current.includes(id) ? current.filter((p) => p !== id) : [...current, id];
    const updated2 = saveSettings({ activeBlockingPresets: updated });
    setSettings(updated2);
  };

  const toggleBundle = (bundle: (typeof PRESET_BUNDLES)[0]) => {
    if (!isPremium) return;
    const current = settings.activeBlockingPresets || [];
    const allActive = bundle.presetIds.every((id) => current.includes(id));
    let updated: string[];
    if (allActive) {
      updated = current.filter((id) => !bundle.presetIds.includes(id));
    } else {
      updated = [...new Set([...current, ...bundle.presetIds])];
    }
    const updated2 = saveSettings({ activeBlockingPresets: updated });
    setSettings(updated2);
  };

  const activeCount = (settings.activeBlockingPresets || []).length;

  return (
    <div className="page-enter min-h-[calc(100dvh-80px)]" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div className="px-5 pt-14 pb-4">
        <p className="text-xs font-medium tracking-widest uppercase mb-0.5" style={{ color: "var(--text-muted)" }}>Shield</p>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>Distraction Blocking</h1>
      </div>

      {/* Premium gate banner */}
      {!isPremium ? (
        <div className="mx-4 mb-6 rounded-3xl p-6" style={{ background: "linear-gradient(135deg, #1a0a2e 0%, #0d0d1a 100%)", border: "1px solid rgba(139,92,246,0.3)" }}>
          <div className="text-3xl mb-3">🛡️</div>
          <h2 className="text-lg font-bold mb-2" style={{ color: "var(--text)" }}>Blocking is a Pro feature</h2>
          <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
            Block YouTube Shorts, Instagram Reels, TikTok and more during your focus phases. Automatically lifted during breaks.
          </p>
          <Link href="/paywall">
            <button
              className="w-full h-12 rounded-2xl font-semibold text-sm"
              style={{ background: "#a78bfa", color: "black" }}
            >
              Unlock Focus Loop Pro
            </button>
          </Link>
          <p className="text-xs text-center mt-3" style={{ color: "var(--text-muted)" }}>From $5.99/month · Cancel anytime</p>
        </div>
      ) : (
        <div className="mx-4 mb-4 rounded-2xl px-4 py-3 flex items-center gap-3" style={{
          background: activeCount > 0 ? "rgba(52,211,153,0.08)" : "rgba(245,158,11,0.06)",
          border: `1px solid ${activeCount > 0 ? "rgba(52,211,153,0.2)" : "rgba(245,158,11,0.15)"}`,
        }}>
          <span className="text-xl">{activeCount > 0 ? "🛡️" : "⚠️"}</span>
          <p className="text-sm" style={{ color: activeCount > 0 ? "#34d399" : "var(--text-muted)" }}>
            {activeCount > 0 ? `${activeCount} site${activeCount > 1 ? "s" : ""} will be blocked during focus phases` : "No sites selected for blocking"}
          </p>
        </div>
      )}

      <div className="px-4 space-y-5 pb-8" style={{ opacity: !isPremium ? 0.4 : 1, pointerEvents: !isPremium ? "none" : "auto" }}>
        {/* Quick bundles */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>Quick Bundles</p>
          <div className="grid grid-cols-1 gap-2">
            {PRESET_BUNDLES.map((bundle) => {
              const allActive = isPremium && bundle.presetIds.every((id) => (settings.activeBlockingPresets || []).includes(id));
              return (
                <button
                  key={bundle.id}
                  onClick={() => toggleBundle(bundle)}
                  className="rounded-2xl p-4 text-left flex items-center justify-between transition-all"
                  style={{
                    background: allActive ? "rgba(245,158,11,0.08)" : "var(--surface)",
                    border: allActive ? "1px solid rgba(245,158,11,0.2)" : "1px solid var(--border)",
                  }}
                >
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{bundle.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{bundle.description}</p>
                  </div>
                  <div
                    className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                    style={{ borderColor: allActive ? "#f59e0b" : "var(--border)" }}
                  >
                    {allActive && <div className="w-3 h-3 rounded-full" style={{ background: "#f59e0b" }} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Individual presets */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>Individual Sites</p>
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
            {BLOCKING_PRESETS.map((preset, i) => {
              const isActive = isPremium && (settings.activeBlockingPresets || []).includes(preset.id);
              return (
                <div
                  key={preset.id}
                  className="flex items-center gap-3 px-4 py-4"
                  style={{
                    background: "var(--surface)",
                    borderBottom: i < BLOCKING_PRESETS.length - 1 ? "1px solid var(--border)" : undefined,
                  }}
                >
                  <span className="text-xl w-8 text-center">{preset.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{preset.name}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{preset.description}</p>
                  </div>
                  <Switch
                    checked={isActive}
                    onCheckedChange={() => togglePreset(preset.id)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* How it works note */}
        <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" }}>
          <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>ℹ️ How blocking works</p>
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
            During focus phases, selected sites are marked as blocked. Blocking is lifted automatically during breaks and when the session ends. Full device-level blocking requires a browser extension or system-level app blocker on desktop.
          </p>
        </div>
      </div>
    </div>
  );
}
