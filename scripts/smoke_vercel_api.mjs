import assert from "node:assert/strict";

import currentAutomation from "../apps/web/api/automations/current.js";
import pauseAutomation from "../apps/web/api/automations/current/pause.js";
import resumeAutomation from "../apps/web/api/automations/current/resume.js";
import runAutomation from "../apps/web/api/automations/current/run.js";
import tickAutomation from "../apps/web/api/automations/current/tick.js";
import demoRun from "../apps/web/api/runs/demo.js";
import createRun from "../apps/web/api/runs/index.js";

function invoke(handler, req) {
  const headers = new Map();
  let body = "";
  const res = {
    statusCode: 200,
    setHeader(key, value) {
      headers.set(key.toLowerCase(), value);
    },
    end(value = "") {
      body = value;
    }
  };

  handler(req, res);

  return {
    statusCode: res.statusCode,
    headers,
    body,
    json: body ? JSON.parse(body) : null
  };
}

const demo = invoke(demoRun, { method: "GET" });
assert.equal(demo.statusCode, 200);
assert.equal(demo.json.runId, "RFP-742-B");
assert.equal(demo.json.automation.frequencyMinutes, 5);

const upload = invoke(createRun, {
  method: "POST",
  body: {
    file: "Northwind_Bank_Core_Banking_Cloud_Migration_RFP.pdf",
    rfpText: [
      "Page 1",
      "Northwind Bank Request for Proposal: Core Banking Cloud Migration and Managed Operations RFP ID: NWB-CLOUD-2026-001 | Issue date: July 2026 | Response due: 14 calendar days from issue",
      "Vendor must provide 24x7 support. Supplier shall comply with EU data residency."
    ].join("\n")
  }
});
assert.equal(upload.statusCode, 201);
assert.equal(upload.json.status, "Automation refresh complete");
assert.equal(upload.json.runId, "NWB-CLOUD-2026-001");
assert.equal(upload.json.buyer, "Northwind Bank");
assert.equal(upload.json.project, "Core Banking Cloud Migration and Managed Operations");
assert.equal(upload.json.upload.file, "Northwind_Bank_Core_Banking_Cloud_Migration_RFP.pdf");
assert.equal(upload.json.upload.knowledgeBase, "Banking cloud migration evidence");
assert.ok(upload.json.automationHistory.length > demo.json.automationHistory.length);

const current = invoke(currentAutomation, { method: "GET" });
assert.equal(current.statusCode, 200);
assert.equal(current.json.frequencyMinutes, 5);
assert.equal(current.json.status, "Active");

const update = invoke(currentAutomation, { method: "POST", body: { frequencyMinutes: 10 } });
assert.equal(update.statusCode, 200);
assert.equal(update.json.frequencyMinutes, 10);
assert.equal(update.json.nextRunIn, "10 min");

const invalidUpdate = invoke(currentAutomation, { method: "POST", body: { frequencyMinutes: 0 } });
assert.equal(invalidUpdate.statusCode, 400);
assert.equal(invalidUpdate.json.error, "invalid_frequency");

const pause = invoke(pauseAutomation, { method: "POST" });
assert.equal(pause.statusCode, 200);
assert.equal(pause.json.status, "Paused");

const resume = invoke(resumeAutomation, { method: "POST" });
assert.equal(resume.statusCode, 200);
assert.equal(resume.json.status, "Active");

const manualRun = invoke(runAutomation, { method: "POST" });
assert.equal(manualRun.statusCode, 202);
assert.equal(manualRun.json.run.status, "Completed");
assert.ok(manualRun.json.history.length > 0);

const scheduledTick = invoke(tickAutomation, { method: "POST" });
assert.equal(scheduledTick.statusCode, 202);
assert.equal(scheduledTick.json.run.status, "Completed");

console.log("Vercel API smoke test passed");
