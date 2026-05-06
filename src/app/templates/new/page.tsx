"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveTemplate, getSettings, getTemplates } from "@/lib/storage";
import type { FocusTemplate } from "@/lib/types";
import { generateId } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function NumericInput({
  label,
  value,
  onChange,
  min = 1,
  max = 120,
  suffix = "",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  suffix?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-11 h-11 rounded-xl font-bold text-lg flex items-center justify-center"
          style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }}
        >
          −
        </button>
        <div
          className="flex-1 h-11 rounded-xl text-center font-bold text-xl flex items-center justify-center"
          style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }}
        >
          {value}{suffix}
        </div>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-11 h-11 rounded-xl font-bold text-lg flex items-center justify-center"
          style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function NewTemplatePage() {
  const router = useRouter();
  const [name, setName] = useState("My Focus Loop");
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [rounds, setRounds] = useState(4);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
    // Check premium gate
    const settings = getSettings();
    const templates = getTemplates();
    if (!settings.premiumUnlocked && templates.length >= 1) {
      router.replace("/paywall");
    }
  }, [router]);

  if (!mounted) return null;

  const handleSave = () => {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    const template: FocusTemplate = {
      id: generateId(),
      name: name.trim(),
      focusMinutes,
      breakMinutes,
      rounds,
      isDefault: false,
      createdAt: new Date().toISOString(),
    };
    saveTemplate(template);
    router.push("/templates");
  };

  const presets = [
    { name: "Classic Pomodoro", focus: 25, brk: 5, rounds: 4 },
    { name: "Deep Work", focus: 50, brk: 10, rounds: 3 },
    { name: "Study Sprint", focus: 45, brk: 15, rounds: 3 },
    { name: "Quick Focus", focus: 15, brk: 3, rounds: 6 },
  ];

  return (
    <div className="page-enter min-h-[calc(100dvh-80px)]" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-14 pb-6">
        <button onClick={() => router.back()} style={{ color: "var(--text-muted)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>New Template</h1>
      </div>

      <div className="px-4 space-y-6 pb-8">
        {/* Name */}
        <div>
          <Label>Template Name</Label>
          <Input
            value={name}
            onChange={(e) => { setName(e.target.value); setError(""); }}
            placeholder="e.g. Deep Work Session"
          />
          {error && <p className="text-xs mt-1.5" style={{ color: "#f87171" }}>{error}</p>}
        </div>

        {/* Quick presets */}
        <div>
          <Label>Quick Presets</Label>
          <div className="grid grid-cols-2 gap-2">
            {presets.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => { setName(p.name); setFocusMinutes(p.focus); setBreakMinutes(p.brk); setRounds(p.rounds); }}
                className="rounded-xl p-3 text-left hover:opacity-80 transition-opacity"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <p className="text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>{p.name}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{p.focus}m / {p.brk}m × {p.rounds}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Focus duration */}
        <NumericInput
          label="Focus Duration (minutes)"
          value={focusMinutes}
          onChange={setFocusMinutes}
          min={5}
          max={120}
          suffix="m"
        />

        {/* Break duration */}
        <NumericInput
          label="Break Duration (minutes)"
          value={breakMinutes}
          onChange={setBreakMinutes}
          min={1}
          max={60}
          suffix="m"
        />

        {/* Rounds */}
        <NumericInput
          label="Rounds"
          value={rounds}
          onChange={setRounds}
          min={1}
          max={12}
        />

        {/* Preview */}
        <div
          className="rounded-2xl p-4"
          style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)" }}
        >
          <p className="text-xs font-semibold mb-1" style={{ color: "#f59e0b" }}>Session Preview</p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {rounds} rounds × {focusMinutes}m focus + {breakMinutes}m break
            {" "}= <span style={{ color: "var(--text)" }}>{focusMinutes * rounds}m total focus</span>
          </p>
        </div>

        {/* Save */}
        <Button variant="focus" size="lg" className="w-full" onClick={handleSave}>
          Save Template
        </Button>
      </div>
    </div>
  );
}
