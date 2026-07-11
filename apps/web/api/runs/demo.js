import { demoRun, methodNotAllowed, optionsResponse, sendJson } from "../_bidforge.js";

export default function handler(req, res) {
  if (req.method === "OPTIONS") {
    return optionsResponse(res);
  }
  if (req.method !== "GET") {
    return methodNotAllowed(res, ["GET"]);
  }
  return sendJson(res, 200, demoRun());
}
