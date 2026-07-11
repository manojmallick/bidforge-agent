import { bidForgeDemoRun } from "../../../src/data/bidforgeDemoRun";
import { methodNotAllowed, optionsResponse, runRecord, sendJson } from "../../_bidforge";

export default function handler(req: any, res: any) {
  if (req.method === "OPTIONS") {
    return optionsResponse(res);
  }
  if (req.method !== "POST") {
    return methodNotAllowed(res, ["POST"]);
  }
  const record = runRecord("Manual");
  return sendJson(res, 202, {
    automation: { ...bidForgeDemoRun.automation, lastRunAt: "Just now", nextRunIn: "5 min" },
    run: record,
    history: [record, ...bidForgeDemoRun.automationHistory],
    auditTrail: bidForgeDemoRun.auditTrail
  });
}
