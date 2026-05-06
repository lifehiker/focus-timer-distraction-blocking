"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getTemplates, saveTemplate } from "@/lib/storage";
import type { FocusTemplate } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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

export default function EditTemplatePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [template, setTemplate] = useState<FocusTemplate | null>(null);
  const [name, setName] = useState("");
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [rounds, setRounds] = useState(4);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const templates = getTemplates();
    const t = templates.find((t) => t.id === id);
    if (t) {
      setTemplate(t);
      setName(t.name);
      setFocusMinutes(t.focusMinutes);
      setBreakMinutes(t.breakMinutes);
      setRounds(t.rounds);
    } else {
      router.replace("/templates");
    }
    setMounted(true);
  }, [id, router]);

  if (!mounted || !template) return null;

  const handleSave = () => {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    saveTemplate({ ...template, name: name.trim(), focusMinutes, breakMinutes, rounds });
    router.push("/templates");
  };

  return (
    <div className="page-enter min-h-[calc(100dvh-80px)]" style={{ background: "var(--bg)" }}>
      <div className="flex items-center gap-3 px-5 pt-14 pb-6">
        <button onClick={() => router.back()} style={{ color: "var(--text-muted)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>Edit Template</h1>
      </div>

      <div className="px-4 space-y-6 pb-8">
        <div>
          <Label>Template Name</Label>
          <Input
            value={name}
            onChange={(e) => { setName(e.target.value); setError(""); }}
            placeholder="e.g. Deep Work Session"
          />
          {error && <p className="text-xs mt-1.5" style={{ color: "#f87171" }}>{error}</p>}
        </div>

        <NumericInput label="Focus Duration (minutes)" value={focusMinutes} onChange={setFocusMinutes} min={5} max={120} suffix="m" />
        <NumericInput label="Break Duration (minutes)" value={breakMinutes} onChange={setBreakMinutes} min={1} max={60} suffix="m" />
        <NumericInput label="Rounds" value={rounds} onChange={setRounds} min={1} max={12} />

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

        <Button variant="focus" size="lg" className="w-full" onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
