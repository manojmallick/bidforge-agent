import type { ReactNode } from "react";

export type BadgeTone = "danger" | "warning" | "success" | "muted" | "dark" | "teal";

export function Badge({ children, tone = "muted" }: { children: ReactNode; tone?: BadgeTone }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}
