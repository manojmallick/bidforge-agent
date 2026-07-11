import { methodNotAllowed, optionsResponse, requestBody, sendJson, uploadedRun } from "../_bidforge";

export default function handler(req: any, res: any) {
  if (req.method === "OPTIONS") {
    return optionsResponse(res);
  }
  if (req.method !== "POST") {
    return methodNotAllowed(res, ["POST"]);
  }
  return sendJson(res, 201, uploadedRun(requestBody(req)));
}
