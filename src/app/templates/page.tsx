"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getTemplates, deleteTemplate, setDefaultTemplate, duplicateTemplate, getSettings } from "@/lib/storage";
import type { FocusTemplate, AppSettings } from "@/lib/types";
import { formatDuration } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<FocusTemplate[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const refresh = () => {
    setTemplates(getTemplates());
    setSettings(getSettings());
  };

  useEffect(() => {
    refresh();
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isPremium = settings?.premiumUnlocked ?? false;
  const canAddMore = isPremium || templates.length < 1;

  const handleDelete = (id: string) => {
    if (templates.length <= 1) return;
    deleteTemplate(id);
    refresh();
    setDeleteId(null);
  };

  const handleDuplicate = (id: string) => {
    if (!canAddMore) {
      router.push("/paywall");
      return;
    }
    duplicateTemplate(id);
    refresh();
  };

  const handleSetDefault = (id: string) => {
    setDefaultTemplate(id);
    refresh();
  };

  return (
    <div className="page-enter min-h-[calc(100dvh-80px)]" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div className="px-5 pt-14 pb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium tracking-widest uppercase mb-0.5" style={{ color: "var(--text-muted)" }}>Manage</p>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>Templates</h1>
        </div>
        {canAddMore ? (
          <Link href="/templates/new">
            <Button variant="focus" size="sm">
              <svg className="mr-1.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New
            </Button>
          </Link>
        ) : (
          <Link href="/paywall">
            <Button variant="outline" size="sm">
              <span className="mr-1.5">⚡</span> Upgrade
            </Button>
          </Link>
        )}
      </div>

      {/* Free tier notice */}
      {!isPremium && (
        <div className="mx-4 mb-4 rounded-2xl px-4 py-3 flex items-center gap-2" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)" }}>
          <span className="text-lg">⚡</span>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Free plan includes 1 template. <Link href="/paywall" className="underline" style={{ color: "#f59e0b" }}>Upgrade</Link> for unlimited.
          </p>
        </div>
      )}

      {/* Template list */}
      <div className="px-4 space-y-3 pb-6">
        {templates.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📋</p>
            <p className="font-semibold mb-2" style={{ color: "var(--text)" }}>No templates yet</p>
            <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>Create your first focus loop template</p>
            <Link href="/templates/new">
              <Button variant="focus">Create Template</Button>
            </Link>
          </div>
        ) : (
          templates.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl p-4 relative"
              style={{
                background: t.isDefault ? "linear-gradient(135deg, #1a1506 0%, #111118 100%)" : "var(--surface)",
                border: t.isDefault ? "1px solid rgba(245,158,11,0.25)" : "1px solid var(--border)",
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-semibold" style={{ color: "var(--text)" }}>{t.name}</h3>
                    {t.isDefault && <Badge variant="focus">Default</Badge>}
                  </div>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Total: {formatDuration(t.focusMinutes * t.rounds)} focus
                  </p>
                </div>
              </div>

              {/* Template stats row */}
              <div className="flex gap-2 mb-4">
                {[
                  { label: "Focus", value: `${t.focusMinutes}m`, color: "#f59e0b" },
                  { label: "Break", value: `${t.breakMinutes}m`, color: "#34d399" },
                  { label: "Rounds", value: `×${t.rounds}`, color: "var(--text)" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex-1 rounded-xl p-2.5 text-center"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <p className="text-base font-bold" style={{ color: stat.color }}>{stat.value}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/session`)}
                  onClickCapture={() => {
                    sessionStorage.setItem("active_template", JSON.stringify(t));
                  }}
                  className="flex-1 h-9 rounded-xl text-xs font-semibold text-black"
                  style={{ background: "#f59e0b" }}
                >
                  Start
                </button>
                <Link href={`/templates/${t.id}/edit`} className="flex-1">
                  <button className="w-full h-9 rounded-xl text-xs font-medium" style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                    Edit
                  </button>
                </Link>
                {!t.isDefault && (
                  <button
                    onClick={() => handleSetDefault(t.id)}
                    className="h-9 px-3 rounded-xl text-xs font-medium"
                    style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
                  >
                    Default
                  </button>
                )}
                <button
                  onClick={() => handleDuplicate(t.id)}
                  className="h-9 w-9 rounded-xl flex items-center justify-center"
                  style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-muted)" }}>
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                  </svg>
                </button>
                {templates.length > 1 && (
                  <button
                    onClick={() => setDeleteId(t.id)}
                    className="h-9 w-9 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-sm rounded-3xl p-6" style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
            <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text)" }}>Delete template?</h3>
            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 h-12 rounded-2xl font-medium"
                style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 h-12 rounded-2xl font-semibold"
                style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
