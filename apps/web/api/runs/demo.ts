import { demoRun, methodNotAllowed, optionsResponse, sendJson } from "../_bidforge";

export default function handler(req: any, res: any) {
  if (req.method === "OPTIONS") {
    return optionsResponse(res);
  }
  if (req.method !== "GET") {
    return methodNotAllowed(res, ["GET"]);
  }
  return sendJson(res, 200, demoRun());
}
