#!/usr/bin/env python3
"""
Century 21 Questionnaire - Local Development Server
Uses Python's built-in HTTP server
Works without Node.js for static file serving
"""

import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class QuestionnaireHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def end_headers(self):
        # Add headers to prevent caching during development
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def main():
    print("╔════════════════════════════════════════════════════════╗")
    print("║  Century 21 Questionnaire - Local Server (Python)     ║")
    print("╚════════════════════════════════════════════════════════╝")
    print()
    print(f"📁 Serving files from: {DIRECTORY}")
    print(f"🌐 Server running at: http://localhost:{PORT}")
    print()
    print("📝 Available endpoints:")
    print(f"   • Landing:  http://localhost:{PORT}")
    print(f"   • Form:     http://localhost:{PORT}/form")
    print(f"   • Admin:    http://localhost:{PORT}/admin")
    print()
    print("⏹️  Press Ctrl+C to stop")
    print()
    
    try:
        with socketserver.TCPServer(("", PORT), QuestionnaireHTTPRequestHandler) as httpd:
            print(f"✅ Server started successfully")
            print()
            # Uncomment to auto-open browser:
            # webbrowser.open(f'http://localhost:{PORT}')
            httpd.serve_forever()
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Port {PORT} is already in use")
            print(f"Try: lsof -i :{PORT}")
            print(f"Or use a different port: python3 serve.py --port 3001")
        else:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
