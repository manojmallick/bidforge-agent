import { demoRun, methodNotAllowed, optionsResponse, runRecord, sendJson } from "../../_bidforge.js";

export default function handler(req, res) {
  if (req.method === "OPTIONS") {
    return optionsResponse(res);
  }
  if (req.method !== "POST") {
    return methodNotAllowed(res, ["POST"]);
  }
  const runData = demoRun();
  const record = runRecord("Manual");
  return sendJson(res, 202, {
    automation: { ...runData.automation, lastRunAt: "Just now", nextRunIn: "5 min" },
    run: record,
    history: [record, ...runData.automationHistory],
    auditTrail: runData.auditTrail
  });
}
