"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSettings, saveSettings } from "@/lib/storage";
import type { AppSettings } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    id: "annual",
    name: "Annual",
    price: "$29.99",
    period: "/year",
    subtext: "7-day free trial",
    perMonth: "$2.50/mo",
    highlight: true,
    badge: "Best Value",
    color: "#f59e0b",
  },
  {
    id: "monthly",
    name: "Monthly",
    price: "$5.99",
    period: "/month",
    subtext: "No commitment",
    perMonth: "",
    highlight: false,
    badge: "",
    color: "var(--text)",
  },
  {
    id: "lifetime",
    name: "Lifetime",
    price: "$39.99",
    period: " one-time",
    subtext: "Pay once, own forever",
    perMonth: "No renewals",
    highlight: false,
    badge: "",
    color: "var(--text)",
  },
];

const features = [
  { icon: "📋", label: "Unlimited templates", desc: "Create as many loops as you want" },
  { icon: "🛡️", label: "Distraction blocking", desc: "Block Shorts, Reels, TikTok during focus" },
  { icon: "📊", label: "Pattern tracking", desc: "See which templates get you focused" },
  { icon: "📅", label: "Full session history", desc: "Access all your past sessions" },
  { icon: "⚡", label: "Premium presets", desc: "Curated blocking bundles" },
];

export default function PaywallPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [selectedPlan, setSelectedPlan] = useState("annual");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const s = getSettings();
    setSettings(s);
    if (s.premiumUnlocked) {
      router.push("/");
    }
    setMounted(true);
  }, [router]);

  if (!mounted) return null;
  if (settings?.premiumUnlocked) return null;

  const handleUnlock = () => {
    setLoading(true);
    // Simulate purchase flow (in production this would use StoreKit / Stripe)
    setTimeout(() => {
      const updated = saveSettings({ premiumUnlocked: true });
      setSettings(updated);
      setLoading(false);
      router.push("/");
    }, 1200);
  };

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-4">
        <button onClick={() => router.back()} style={{ color: "var(--text-muted)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>Focus Loop Pro</p>
        <div style={{ width: "20px" }} />
      </div>

      <div className="flex-1 px-4 pb-6">
        {/* Hero */}
        <div className="text-center py-6">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4"
            style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(139,92,246,0.2) 100%)", border: "1px solid rgba(245,158,11,0.2)" }}
          >
            ⚡
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text)" }}>Unlock Focus Loop Pro</h1>
          <p className="text-sm max-w-xs mx-auto" style={{ color: "var(--text-muted)" }}>
            The complete focus toolkit — blocking, unlimited templates, and pattern insights
          </p>
        </div>

        {/* Features */}
        <div className="space-y-2 mb-6">
          {features.map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <span className="text-xl">{f.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{f.label}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{f.desc}</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          ))}
        </div>

        {/* Plans */}
        <div className="space-y-3 mb-6">
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className="w-full text-left rounded-2xl p-4 transition-all"
              style={{
                background: selectedPlan === plan.id
                  ? "linear-gradient(135deg, #1a1506 0%, #12120a 100%)"
                  : "var(--surface)",
                border: selectedPlan === plan.id
                  ? "2px solid rgba(245,158,11,0.5)"
                  : "1px solid var(--border)",
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-base font-bold" style={{ color: "var(--text)" }}>{plan.name}</p>
                    {plan.badge && <Badge variant="focus">{plan.badge}</Badge>}
                  </div>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{plan.subtext}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold" style={{ color: selectedPlan === plan.id ? "#f59e0b" : "var(--text)" }}>
                    {plan.price}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{plan.period}</p>
                  {plan.perMonth && <p className="text-xs" style={{ color: "#34d399" }}>{plan.perMonth}</p>}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={handleUnlock}
          disabled={loading}
          className="w-full h-14 rounded-2xl font-bold text-base text-black mb-3 transition-opacity disabled:opacity-70"
          style={{ background: loading ? "#d97706" : "#f59e0b" }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Processing...
            </span>
          ) : (
            `Start with ${plans.find((p) => p.id === selectedPlan)?.name} Plan`
          )}
        </button>

        <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
          {selectedPlan === "annual" && "Includes 7-day free trial. Cancel anytime before trial ends."}
          {selectedPlan === "monthly" && "Billed monthly. Cancel anytime."}
          {selectedPlan === "lifetime" && "One-time payment. Lifetime access."}
        </p>

        <p className="text-xs text-center mt-2" style={{ color: "var(--text-subtle)" }}>
          Web demo: payment is simulated. Real app uses StoreKit 2.
        </p>
      </div>
    </div>
  );
}
