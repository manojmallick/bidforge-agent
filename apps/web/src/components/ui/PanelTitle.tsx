import type { ReactNode } from "react";

export function PanelTitle({ icon, title, action, onAction }: { icon: ReactNode; title: string; action?: string; onAction?: () => void | Promise<void> }) {
  return (
    <div className="panelTitle">
      <div>{icon}<h2>{title}</h2></div>
      {action ? <button type="button" onClick={onAction}>{action}</button> : null}
    </div>
  );
}
