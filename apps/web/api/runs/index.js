import { methodNotAllowed, optionsResponse, requestBody, sendJson, uploadedRun } from "../_bidforge.js";

export default function handler(req, res) {
  if (req.method === "OPTIONS") {
    return optionsResponse(res);
  }
  if (req.method !== "POST") {
    return methodNotAllowed(res, ["POST"]);
  }
  return sendJson(res, 201, uploadedRun(requestBody(req)));
}
