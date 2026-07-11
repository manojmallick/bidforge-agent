import { automationState, methodNotAllowed, optionsResponse, sendJson } from "../../_bidforge";

export default function handler(req: any, res: any) {
  if (req.method === "OPTIONS") {
    return optionsResponse(res);
  }
  if (req.method !== "POST") {
    return methodNotAllowed(res, ["POST"]);
  }
  return sendJson(res, 200, automationState({ status: "Active", nextRunIn: "5 min" }));
}
