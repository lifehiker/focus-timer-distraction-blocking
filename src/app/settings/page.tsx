"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSettings, saveSettings } from "@/lib/storage";
import type { AppSettings } from "@/lib/types";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>("default");
  const [mounted, setMounted] = useState(false);
  const [restoreMsg, setRestoreMsg] = useState("");

  useEffect(() => {
    setSettings(getSettings());
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotifPermission(Notification.permission);
    }
    setMounted(true);
  }, []);

  if (!mounted || !settings) return null;

  const toggleNotifications = async () => {
    if (!settings.notificationsEnabled) {
      if (typeof window !== "undefined" && "Notification" in window) {
        const result = await Notification.requestPermission();
        setNotifPermission(result);
        if (result === "granted") {
          const updated = saveSettings({ notificationsEnabled: true });
          setSettings(updated);
        }
      }
    } else {
      const updated = saveSettings({ notificationsEnabled: false });
      setSettings(updated);
    }
  };

  const handleRestorePurchases = () => {
    // Simulated restore in web version
    setRestoreMsg("No purchases found. Visit the upgrade page to subscribe.");
    setTimeout(() => setRestoreMsg(""), 3000);
  };

  const settingsSections = [
    {
      title: "Preferences",
      items: [
        {
          key: "notifications",
          label: "Focus Notifications",
          description: "Get notified when phases change",
          right: (
            <Switch
              checked={settings.notificationsEnabled && notifPermission === "granted"}
              onCheckedChange={toggleNotifications}
            />
          ),
        },
        {
          key: "blocking",
          label: "Distraction Blocking",
          description: "Configure sites to block",
          right: (
            <Link href="/blocking" className="flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
              <span className="text-xs">Configure</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          ),
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          key: "plan",
          label: "Current Plan",
          description: settings.premiumUnlocked ? "Focus Loop Pro" : "Free tier",
          right: settings.premiumUnlocked ? (
            <Badge variant="focus">Pro</Badge>
          ) : (
            <Link href="/paywall">
              <span className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)" }}>
                Upgrade
              </span>
            </Link>
          ),
        },
        {
          key: "restore",
          label: "Restore Purchases",
          description: "Recover your Pro subscription",
          right: (
            <button
              onClick={handleRestorePurchases}
              className="text-xs font-medium"
              style={{ color: "var(--text-muted)" }}
            >
              Restore
            </button>
          ),
        },
      ],
    },
    {
      title: "About",
      items: [
        {
          key: "privacy",
          label: "Privacy",
          description: "All data is stored locally on your device — nothing is sent to any server",
          right: null,
        },
        {
          key: "version",
          label: "Version",
          description: "Focus Loop 1.0.0",
          right: null,
        },
        {
          key: "support",
          label: "Support & Feedback",
          description: "Get help or report an issue",
          right: (
            <a
              href="mailto:support@focusloop.app"
              className="text-xs font-medium"
              style={{ color: "var(--text-muted)" }}
            >
              Contact
            </a>
          ),
        },
      ],
    },
  ];

  return (
    <div className="page-enter min-h-[calc(100dvh-80px)]" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div className="px-5 pt-14 pb-6">
        <p className="text-xs font-medium tracking-widest uppercase mb-0.5" style={{ color: "var(--text-muted)" }}>Preferences</p>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>Settings</h1>
      </div>

      {restoreMsg && (
        <div className="mx-4 mb-4 rounded-2xl px-4 py-3" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)" }}>
          <p className="text-sm" style={{ color: "#f59e0b" }}>{restoreMsg}</p>
        </div>
      )}

      <div className="px-4 space-y-6 pb-8">
        {settingsSections.map((section) => (
          <div key={section.title}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3 px-1" style={{ color: "var(--text-muted)" }}>
              {section.title}
            </p>
            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
              {section.items.map((item, i) => (
                <div
                  key={item.key}
                  className="flex items-center gap-3 px-4 py-4"
                  style={{
                    background: "var(--surface)",
                    borderBottom: i < section.items.length - 1 ? "1px solid var(--border)" : undefined,
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: "var(--text)" }}>{item.label}</p>
                    {item.description && (
                      <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{item.description}</p>
                    )}
                  </div>
                  {item.right && <div className="flex-shrink-0">{item.right}</div>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
