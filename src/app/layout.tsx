import type { Metadata } from "next";
import "./globals.css";
import { BottomNav } from "@/components/nav/BottomNav";

export const metadata: Metadata = {
  title: "Focus Loop: Timer & Blocker",
  description: "Focus sessions that block Shorts and Reels. Repeatable timer loops with distraction blocking.",
  keywords: "pomodoro timer, focus timer, study timer, distraction blocker, block shorts, block reels",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ background: "var(--bg)", minHeight: "100dvh" }}>
        <main style={{ paddingBottom: "80px", minHeight: "100dvh" }}>
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
