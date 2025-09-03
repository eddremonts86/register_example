#!/usr/bin/env python3
"""
Simple HTTP server to serve the shadcn/ui component registry
"""

import http.server
import socketserver
import json
import os
from urllib.parse import urlparse

PORT = 8080
REGISTRY_DIR = './public/r'
COMPONENTS_DIR = './registry'

class RegistryHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        path = urlparse(self.path).path

        # Handle CORS
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

        # Serve registry.json at root
        if path == '/registry.json':
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            try:
                with open('./registry.json', 'r') as f:
                    self.wfile.write(f.read().encode())
            except FileNotFoundError:
                self.send_error(404, "Registry not found")
            return

        # Serve component definitions from /r/
        if path.startswith('/r/'):
            component_name = path[3:]  # Remove '/r/' prefix
            if component_name.endswith('.json'):
                component_file = os.path.join(REGISTRY_DIR, component_name)
                if os.path.exists(component_file):
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    with open(component_file, 'r') as f:
                        self.wfile.write(f.read().encode())
                    return

        # Default to 404
        self.send_error(404, f"File not found: {path}")

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

if __name__ == "__main__":
    # Change to the correct directory
    os.chdir('/Volumes/Developer/Projects/newTest/myApp/app-x')

    with socketserver.TCPServer(("", PORT), RegistryHandler) as httpd:
        print(f"🚀 Registry server running at http://localhost:{PORT}")
        print(f"📦 Registry: http://localhost:{PORT}/registry.json")
        print(f"🧩 Components: http://localhost:{PORT}/r/")
        print("Press Ctrl+C to stop")

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n👋 Server stopped")
            httpd.shutdown()
