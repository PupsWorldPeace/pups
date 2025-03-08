import http.server
import socketserver
import os
import json
from urllib.parse import urlparse, parse_qs

class FileListHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header("Access-Control-Allow-Headers", "X-Requested-With")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        super().end_headers()
    
    def do_GET(self):
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # Handle API requests
        if path == '/api/list-files':
            query = parse_qs(parsed_path.query)
            directory = query.get('directory', [''])[0]
            
            # Log the requested directory
            print(f"Requested directory: {directory}")
            
            # Validate and sanitize the directory path
            if directory:
                # Ensure the directory is within our assets folder
                if not directory.startswith('assets/'):
                    directory = 'assets/' + directory.lstrip('/')
                
                # Remove any attempts to navigate up the directory
                directory = directory.replace('../', '').replace('..\\', '')
                
                # Convert forward slashes to backslashes for Windows
                directory_os = directory.replace('/', os.sep)
                
                print(f"Normalized directory path: {directory_os}")
                
                if os.path.exists(directory_os) and os.path.isdir(directory_os):
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    
                    # Get all files in the directory
                    file_list = []
                    try:
                        for file in os.listdir(directory_os):
                            file_path = os.path.join(directory_os, file)
                            if os.path.isfile(file_path):
                                # Use forward slashes for web paths
                                web_path = file_path.replace(os.sep, '/')
                                file_list.append(web_path)
                                print(f"Added file: {web_path}")
                    except Exception as e:
                        print(f"Error listing directory: {e}")
                    
                    response = {"files": file_list}
                    self.wfile.write(json.dumps(response).encode())
                    print(f"Returning {len(file_list)} files")
                    return
                else:
                    print(f"Directory not found: {directory_os}")
            
            # If we reached here, something was invalid
            self.send_response(404)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Directory not found"}).encode())
            return
        
        # Otherwise, handle it as a regular request
        return super().do_GET()

# Run the server
port = 8080
handler = FileListHandler
httpd = socketserver.TCPServer(("", port), handler)
print(f"Server running at http://localhost:{port}")
try:
    httpd.serve_forever()
except KeyboardInterrupt:
    print("Server stopped by user.")
    httpd.shutdown()
