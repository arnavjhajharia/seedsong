import http.server, sys, os
OUT = sys.argv[1]
class H(http.server.BaseHTTPRequestHandler):
    def _cors(self):
        self.send_header('Access-Control-Allow-Origin', '*'); self.send_header('Access-Control-Allow-Methods', 'PUT, OPTIONS'); self.send_header('Access-Control-Allow-Headers', '*')
    def do_OPTIONS(self): self.send_response(204); self._cors(); self.end_headers()
    def do_PUT(self):
        n = int(self.headers.get('Content-Length', 0)); data = self.rfile.read(n)
        name = os.path.basename(self.path) or 'out.webm'
        open(os.path.join(OUT, name), 'wb').write(data)
        self.send_response(201); self._cors(); self.end_headers()
http.server.HTTPServer(('127.0.0.1', 8766), H).serve_forever()
