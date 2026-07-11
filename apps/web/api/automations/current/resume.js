import { automationState, methodNotAllowed, optionsResponse, sendJson } from "../../_bidforge.js";

export default function handler(req, res) {
  if (req.method === "OPTIONS") {
    return optionsResponse(res);
  }
  if (req.method !== "POST") {
    return methodNotAllowed(res, ["POST"]);
  }
  return sendJson(res, 200, automationState({ status: "Active", nextRunIn: "5 min" }));
}
