import { automationState, methodNotAllowed, optionsResponse, runRecord, sendJson } from "../../_bidforge.js";

export default function handler(req, res) {
  if (req.method === "OPTIONS") {
    return optionsResponse(res);
  }
  if (req.method !== "POST") {
    return methodNotAllowed(res, ["POST"]);
  }
  const record = runRecord("Scheduled");
  return sendJson(res, 202, {
    automation: automationState({ lastRunAt: "Just now", nextRunIn: "5 min" }),
    run: record,
    history: [record, ...automationState().history],
    auditTrail: automationState().auditTrail
  });
}
