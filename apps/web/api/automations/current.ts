import { automationState, methodNotAllowed, optionsResponse, requestBody, sendJson } from "../_bidforge";

export default function handler(req: any, res: any) {
  if (req.method === "OPTIONS") {
    return optionsResponse(res);
  }
  if (req.method === "GET") {
    return sendJson(res, 200, automationState());
  }
  if (req.method === "POST") {
    const payload = requestBody(req);
    const frequency = Number(payload.frequencyMinutes ?? 5);
    if (!Number.isInteger(frequency) || frequency < 1 || frequency > 1440) {
      return sendJson(res, 400, {
        error: "invalid_frequency",
        message: "Automation frequency must be an integer between 1 and 1440 minutes."
      });
    }
    return sendJson(res, 200, automationState({ frequencyMinutes: frequency, nextRunIn: `${frequency} min` }));
  }
  return methodNotAllowed(res, ["GET", "POST"]);
}
