"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveSettings, initializeStorage } from "@/lib/storage";
import { Button } from "@/components/ui/button";

const steps = [
  {
    id: 0,
    emoji: "⏱️",
    title: "Repeatable focus loops",
    subtitle: "Work smarter with timer templates",
    body: "Set up work/break timer loops that fit your style — 25/5, 45/10, or anything you want. Run the same template every day and discover what interval keeps you in the zone.",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.2)",
  },
  {
    id: 1,
    emoji: "🛡️",
    title: "Block while you focus",
    subtitle: "Stop short-form feed relapse",
    body: "Automatically block YouTube Shorts, Instagram Reels, TikTok, and other feeds during your focus phases. During breaks, everything's unlocked. After the session ends, blocking stops.",
    color: "#a78bfa",
    bg: "rgba(139,92,246,0.08)",
    border: "rgba(139,92,246,0.2)",
  },
  {
    id: 2,
    emoji: "📊",
    title: "Learn what works for you",
    subtitle: "Personal pattern tracking",
    body: "Track sessions, completion rates, and total focus minutes. Compare your templates — does 25/5 or 45/10 get you more done? Find the loop that actually works.",
    color: "#34d399",
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.2)",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [notifStatus, setNotifStatus] = useState<"idle" | "granted" | "denied">("idle");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    initializeStorage();
    setMounted(true);
  }, []);

  const requestNotifications = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return;
    }
    const result = await Notification.requestPermission();
    setNotifStatus(result === "granted" ? "granted" : "denied");
    if (result === "granted") {
      saveSettings({ notificationsEnabled: true });
    }
  };

  const finish = (timerOnly = false) => {
    saveSettings({
      hasCompletedOnboarding: true,
      blockingEnabled: !timerOnly,
    });
    router.push("/");
  };

  if (!mounted) return null;

  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div
      className="min-h-dvh flex flex-col"
      style={{ background: "var(--bg)" }}
    >
      {/* Skip button */}
      <div className="flex justify-end px-5 pt-14">
        <button
          onClick={() => finish(true)}
          className="text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          Skip
        </button>
      </div>

      {/* Step dots */}
      <div className="flex items-center justify-center gap-2 px-5 pt-4 pb-8">
        {steps.map((s, i) => (
          <div
            key={s.id}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === step ? "24px" : "8px",
              height: "8px",
              background: i === step ? current.color : i < step ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center px-6 pb-8">
        {/* Emoji card */}
        <div
          className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl mb-8"
          style={{ background: current.bg, border: `1px solid ${current.border}` }}
        >
          {current.emoji}
        </div>

        <h1 className="text-2xl font-bold text-center mb-2" style={{ color: "var(--text)" }}>
          {current.title}
        </h1>
        <p className="text-sm font-medium mb-4 text-center" style={{ color: current.color }}>
          {current.subtitle}
        </p>
        <p className="text-base text-center leading-relaxed max-w-xs" style={{ color: "var(--text-muted)" }}>
          {current.body}
        </p>

        {/* Permissions step */}
        {isLast && (
          <div className="w-full mt-8 space-y-3">
            <div
              className="rounded-2xl p-4 flex items-center gap-3"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div className="text-2xl">🔔</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>Notifications</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Get notified when phases change</p>
              </div>
              {notifStatus === "granted" ? (
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(52,211,153,0.15)", color: "#34d399" }}>On</span>
              ) : (
                <button
                  onClick={requestNotifications}
                  className="text-xs px-3 py-1.5 rounded-full font-medium"
                  style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)" }}
                >
                  Allow
                </button>
              )}
            </div>

            <div
              className="rounded-2xl p-4 flex items-center gap-3"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div className="text-2xl">🛡️</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>Distraction Blocking</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Set up blocking presets later</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(139,92,246,0.15)", color: "#a78bfa" }}>Pro</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom buttons */}
      <div className="px-5 pb-10 space-y-3">
        {isLast ? (
          <>
            <button
              onClick={() => finish(false)}
              className="w-full h-14 rounded-2xl font-semibold text-base text-black"
              style={{ background: "#f59e0b" }}
            >
              Get Started
            </button>
            <button
              onClick={() => finish(true)}
              className="w-full h-12 rounded-2xl text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              Use timer only (no blocking)
            </button>
          </>
        ) : (
          <button
            onClick={() => setStep((s) => s + 1)}
            className="w-full h-14 rounded-2xl font-semibold text-base text-black"
            style={{ background: current.color }}
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
