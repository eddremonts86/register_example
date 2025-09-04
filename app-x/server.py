#!/usr/bin/env python3
"""
Simple HTTP server to serve the shadcn/ui registry
Usage: python server.py [port]
Default port: 8080
"""

import http.server
import socketserver
import os
import sys
import signal
from urllib.parse import urlparse, parse_qs
import json

class RegistryHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Parse the URL
        parsed_path = urlparse(self.path)
        path = parsed_path.path

        # Handle registry requests
        if path == '/registry/index.json':
            self.serve_registry_index()
        elif path.startswith('/registry/ui/'):
            self.serve_component(path)
        else:
            # Serve static files from public directory
            super().do_GET()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def serve_registry_index(self):
        try:
            with open('public/registry/index.json', 'r') as f:
                content = f.read()
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            self.wfile.write(content.encode())
        except FileNotFoundError:
            self.send_error(404, "Registry index not found")

    def serve_component(self, path):
        try:
            # Remove /registry/ prefix to get the file path
            file_path = 'public' + path
            with open(file_path, 'r') as f:
                content = f.read()
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            self.wfile.write(content.encode())
        except FileNotFoundError:
            self.send_error(404, f"Component {path} not found")

def main():
    PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080

    # Change to the directory containing this script
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    # Create server that allows address reuse
    class ReusableTCPServer(socketserver.TCPServer):
        allow_reuse_address = True

    with ReusableTCPServer(("", PORT), RegistryHandler) as httpd:
        print(f"🚀 Registry server running at: http://localhost:{PORT}")
        print(f"📋 Registry index: http://localhost:{PORT}/registry/index.json")
        print(f"🔧 Interactive table: http://localhost:{PORT}/registry/ui/interactive-table.json")
        print(f"💡 Install command: npx shadcn@latest add http://localhost:{PORT}/registry/ui/interactive-table.json")
        print("Press Ctrl+C to stop...")

        # Handle signals properly
        def signal_handler(signum, frame):
            print(f"\n👋 Received signal {signum}, stopping server gracefully...")
            httpd.shutdown()
            sys.exit(0)

        signal.signal(signal.SIGINT, signal_handler)
        signal.signal(signal.SIGTERM, signal_handler)

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n👋 Server stopped")
        finally:
            httpd.server_close()

if __name__ == "__main__":
    main()
