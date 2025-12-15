const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const ROOT_DIR = path.resolve(__dirname, '..');
const ADMIN_DIR = __dirname;

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.mp4': 'video/mp4',
    '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    // API: GET Posts
    if (req.method === 'GET' && req.url === '/api/posts') {
        const filePath = path.join(ROOT_DIR, 'assets', 'data', 'posts.json');
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to read posts file' }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(data);
            }
        });
        return;
    }

    // API: SAVE Posts
    if (req.method === 'POST' && req.url === '/api/posts') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const filePath = path.join(ROOT_DIR, 'assets', 'data', 'posts.json');
            // Basic validation: ensure it's valid JSON
            try {
                JSON.parse(body); // Just to check validity
                fs.writeFile(filePath, body, 'utf8', (err) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Failed to write posts file' }));
                    } else {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: true }));
                    }
                });
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
        return;
    }

    // API: Upload File
    if (req.method === 'POST' && req.url.startsWith('/api/upload')) {
        const urlParams = new URL(req.url, `http://${req.headers.host}`).searchParams;
        const filename = urlParams.get('filename');
        const folder = urlParams.get('folder') || 'assets/img/gallery'; // Default folder
        
        if (!filename) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing filename' }));
            return;
        }

        // Security: Prevent directory traversal & restrict to assets
        const safeFilename = path.basename(filename);
        const targetDir = path.join(ROOT_DIR, folder);
        
        if (!targetDir.startsWith(path.join(ROOT_DIR, 'assets'))) {
             res.writeHead(403, { 'Content-Type': 'application/json' });
             res.end(JSON.stringify({ error: 'Invalid folder. Must be within assets/' }));
             return;
        }

        // Ensure directory exists
        if (!fs.existsSync(targetDir)){
            fs.mkdirSync(targetDir, { recursive: true });
        }

        const filePath = path.join(targetDir, safeFilename);
        const writeStream = fs.createWriteStream(filePath);

        req.pipe(writeStream);

        writeStream.on('finish', () => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            // Return path using forward slashes for web compatibility
            const webPath = path.join(folder, safeFilename).replace(/\\/g, '/');
            res.end(JSON.stringify({ success: true, path: webPath }));
        });

        writeStream.on('error', (err) => {
             console.error('Upload Error:', err);
             res.writeHead(500, { 'Content-Type': 'application/json' });
             res.end(JSON.stringify({ error: 'Upload failed' }));
        });
        return;
    }

    // Static Files
    let filePath;
    
    if (req.url === '/' || req.url === '/index.html') {
        filePath = path.join(ADMIN_DIR, 'index.html');
    } else if (req.url.startsWith('/assets/')) {
        // Serve assets from the project root
        filePath = path.join(ROOT_DIR, req.url);
    } else {
        // Attempt to serve files relative to admin dir (e.g. css/js if added later)
        filePath = path.join(ADMIN_DIR, req.url);
    }

    const extname = path.extname(filePath);
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('404 Not Found');
            } else {
                res.writeHead(500);
                res.end('500 Server Error: ' + err.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

server.listen(PORT, () => {
    console.log(`Admin Dashboard running at http://localhost:${PORT}/`);
    console.log('Press Ctrl+C to stop.');
});
