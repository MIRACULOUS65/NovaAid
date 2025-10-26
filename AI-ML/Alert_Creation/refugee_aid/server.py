from __future__ import annotations

import argparse
import json
import os
from http.server import BaseHTTPRequestHandler, HTTPServer
from typing import Any, Dict, List, Tuple

from .model import batch_score, SCHEMA_FIELDS


def _json_response(handler: BaseHTTPRequestHandler, status: int, payload: Any) -> None:
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Content-Length", str(len(body)))
    handler.send_header("Access-Control-Allow-Origin", "*")
    handler.end_headers()
    handler.wfile.write(body)


def _read_json(handler: BaseHTTPRequestHandler) -> Tuple[int, Any]:
    try:
        length = int(handler.headers.get("Content-Length", "0"))
    except ValueError:
        return 400, {"error": "Invalid Content-Length"}
    try:
        raw = handler.rfile.read(length)
        data = json.loads(raw.decode("utf-8")) if raw else None
        return 200, data
    except Exception as e:
        return 400, {"error": f"Invalid JSON: {e}"}


class App(BaseHTTPRequestHandler):
    def do_OPTIONS(self) -> None:  # CORS preflight
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self) -> None:
        if self.path == "/health":
            _json_response(self, 200, {"status": "ok"})
            return
        if self.path == "/schema":
            _json_response(self, 200, {"fields": SCHEMA_FIELDS})
            return
        if self.path == "/":
            # Serve the HTML interface
            try:
                static_dir = os.path.join(os.path.dirname(__file__), "static")
                html_path = os.path.join(static_dir, "index.html")
                with open(html_path, "r", encoding="utf-8") as f:
                    html = f.read()
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(html.encode("utf-8"))))
                self.end_headers()
                self.wfile.write(html.encode("utf-8"))
            except Exception:
                _json_response(
                    self,
                    200,
                    {
                        "service": "refugee_aid",
                        "endpoints": {
                            "/health": "GET",
                            "/schema": "GET",
                            "/score": "POST JSON: object or list of objects",
                            "/dashboard": "GET - Multi-page dashboard",
                        },
                    },
                )
            return
        if self.path == "/dashboard":
            # Serve the dashboard
            try:
                static_dir = os.path.join(os.path.dirname(__file__), "static")
                html_path = os.path.join(static_dir, "dashboard.html")
                with open(html_path, "r", encoding="utf-8") as f:
                    html = f.read()
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(html.encode("utf-8"))))
                self.end_headers()
                self.wfile.write(html.encode("utf-8"))
            except Exception as e:
                _json_response(self, 500, {"error": f"Dashboard not found: {e}"})
            return
        # Handle detail.html with or without query parameters
        if self.path.startswith("/detail.html") or self.path == "/detail":
            # Serve the detail page
            try:
                static_dir = os.path.join(os.path.dirname(__file__), "static")
                html_path = os.path.join(static_dir, "detail.html")
                with open(html_path, "r", encoding="utf-8") as f:
                    html = f.read()
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(html.encode("utf-8"))))
                self.end_headers()
                self.wfile.write(html.encode("utf-8"))
            except Exception as e:
                _json_response(self, 500, {"error": f"Detail page not found: {e}"})
            return
        # Serve static files (CSS, JS) - handle paths with or without leading slash
        if self.path.endswith(".css") or self.path.endswith(".js"):
            try:
                static_dir = os.path.join(os.path.dirname(__file__), "static")
                # Remove leading slash and get filename
                clean_path = self.path.lstrip('/')
                file_path = os.path.join(static_dir, clean_path)
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()
                self.send_response(200)
                if self.path.endswith(".css"):
                    self.send_header("Content-Type", "text/css; charset=utf-8")
                else:
                    self.send_header("Content-Type", "application/javascript; charset=utf-8")
                self.send_header("Content-Length", str(len(content.encode("utf-8"))))
                self.end_headers()
                self.wfile.write(content.encode("utf-8"))
            except FileNotFoundError:
                _json_response(self, 404, {"error": f"File not found: {self.path}"})
            except Exception as e:
                _json_response(self, 500, {"error": f"Error serving file: {e}"})
            return
        _json_response(self, 404, {"error": "Not Found"})

    def do_POST(self) -> None:
        if self.path != "/score":
            _json_response(self, 404, {"error": "Not Found"})
            return
        status, data = _read_json(self)
        if status != 200:
            _json_response(self, status, data)
            return
        try:
            if data is None:
                rows: List[Dict[str, Any]] = []
            elif isinstance(data, list):
                rows = [dict(x) for x in data]
            elif isinstance(data, dict):
                if "items" in data and isinstance(data["items"], list):
                    rows = [dict(x) for x in data["items"]]
                else:
                    rows = [dict(data)]
            else:
                _json_response(self, 400, {"error": "Unsupported JSON structure"})
                return
            out = batch_score(rows)
            _json_response(self, 200, out)
        except Exception as e:
            _json_response(self, 500, {"error": str(e)})


def main(argv: List[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Refugee Aid local HTTP server")
    parser.add_argument("--host", default="127.0.0.1", help="Bind host (default 127.0.0.1)")
    parser.add_argument("--port", type=int, default=3004, help="Port (default 3004)")
    args = parser.parse_args(argv)

    server = HTTPServer((args.host, args.port), App)
    print(f"Refugee Aid server listening on http://{args.host}:{args.port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
