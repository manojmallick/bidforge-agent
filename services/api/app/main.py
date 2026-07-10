from __future__ import annotations

import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse

from app.core.automation_scheduler import (
    get_automation_scheduler_status,
    start_automation_scheduler,
    stop_automation_scheduler,
)
from app.routes.automations import (
    get_automation_response,
    pause_automation_response,
    resume_automation_response,
    run_automation_now_response,
    run_due_automation_response,
    update_automation_response,
)
from app.routes.runs import create_demo_run_response, get_demo_run_response


class BidForgeRequestHandler(BaseHTTPRequestHandler):
    server_version = "BidForgeAgentAPI/0.1"

    def do_OPTIONS(self) -> None:
        self._send_json(204, {})

    def do_GET(self) -> None:
        path = urlparse(self.path).path
        if path == "/health":
            self._send_json(
                200,
                {
                    "status": "ok",
                    "service": "bidforge-agent-api",
                    "automationScheduler": get_automation_scheduler_status(),
                },
            )
            return
        if path == "/api/runs/demo":
            status, payload = get_demo_run_response()
            self._send_json(status, payload)
            return
        if path == "/api/automations/current":
            status, payload = get_automation_response()
            self._send_json(status, payload)
            return
        self._send_json(404, {"error": "not_found", "path": path})

    def do_POST(self) -> None:
        path = urlparse(self.path).path
        content_length = int(self.headers.get("content-length", "0"))
        raw_body = self.rfile.read(content_length) if content_length else b""
        if path == "/api/runs":
            try:
                status, payload = create_demo_run_response(raw_body, dict(self.headers))
            except json.JSONDecodeError:
                self._send_json(400, {"error": "invalid_json"})
                return
            self._send_json(status, payload)
            return
        if path == "/api/automations/current":
            try:
                status, payload = update_automation_response(raw_body, dict(self.headers))
            except json.JSONDecodeError:
                self._send_json(400, {"error": "invalid_json"})
                return
            self._send_json(status, payload)
            return
        if path == "/api/automations/current/run":
            try:
                status, payload = run_automation_now_response(raw_body, dict(self.headers))
            except json.JSONDecodeError:
                self._send_json(400, {"error": "invalid_json"})
                return
            self._send_json(status, payload)
            return
        if path == "/api/automations/current/pause":
            try:
                status, payload = pause_automation_response(raw_body, dict(self.headers))
            except json.JSONDecodeError:
                self._send_json(400, {"error": "invalid_json"})
                return
            self._send_json(status, payload)
            return
        if path == "/api/automations/current/resume":
            try:
                status, payload = resume_automation_response(raw_body, dict(self.headers))
            except json.JSONDecodeError:
                self._send_json(400, {"error": "invalid_json"})
                return
            self._send_json(status, payload)
            return
        if path == "/api/automations/current/tick":
            status, payload = run_due_automation_response()
            self._send_json(status, payload)
            return
        self._send_json(404, {"error": "not_found", "path": path})

    def log_message(self, format: str, *args: object) -> None:
        return

    def _send_json(self, status: int, payload: dict) -> None:
        body = b"" if status == 204 else json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("access-control-allow-origin", "*")
        self.send_header("access-control-allow-methods", "GET,POST,OPTIONS")
        self.send_header("access-control-allow-headers", "content-type")
        self.send_header("content-type", "application/json")
        self.send_header("content-length", str(len(body)))
        self.end_headers()
        if body:
            self.wfile.write(body)


def run(host: str = "127.0.0.1", port: int = 8787) -> None:
    server = ThreadingHTTPServer((host, port), BidForgeRequestHandler)
    start_automation_scheduler()
    print(f"BidForge Agent API running on http://{host}:{port}")
    try:
        server.serve_forever()
    finally:
        stop_automation_scheduler()
        server.server_close()


if __name__ == "__main__":
    run()
