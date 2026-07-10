import { UsersRound } from "lucide-react";
import type { BidForgeRun, TaskStatus } from "../../types/bidforge";
import { PanelTitle } from "../../components/ui/PanelTitle";

const columns: TaskStatus[] = ["Pending", "Assigned", "Answered", "Approved"];

export function SmeTaskBoard({ run }: { run: BidForgeRun }) {
  return (
    <section className="panel wide" id="tasks">
      <PanelTitle icon={<UsersRound size={18} />} title="SME Task Board" />
      <div className="kanban">
        {columns.map((column) => (
          <div className="taskColumn" key={column}>
            <h3>{column}</h3>
            {run.tasks.filter((task) => task.status === column).map((task) => (
              <article className="taskCard" key={task.link}>
                <div><strong>{task.owner.slice(0, 2).toUpperCase()}</strong><span>{task.owner}</span></div>
                <h4>{task.title}</h4>
                <small>{task.link}</small>
              </article>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
