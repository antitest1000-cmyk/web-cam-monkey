/**
 * Tiny static file server for the frontend (no extra npm packages).
 * Default: http://localhost:5173
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 5173;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
};

const PRETTY = {
  '/chat': '/chat.html',
  '/about': '/about.html',
  '/how-it-works': '/how-it-works.html',
  '/safety': '/safety.html',
  '/guidelines': '/guidelines.html',
  '/faq': '/faq.html',
  '/privacy': '/privacy.html',
  '/terms': '/terms.html',
  '/contact': '/contact.html',
};

function send(res, status, body, headers) {
  res.writeHead(status, headers);
  res.end(body);
}

http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  let rel = urlPath === '/' ? '/index.html' : urlPath;
  if (PRETTY[rel]) rel = PRETTY[rel];

  const file = path.normalize(path.join(ROOT, rel));
  if (!file.startsWith(ROOT)) {
    send(res, 403, 'Forbidden');
    return;
  }

  fs.readFile(file, (err, data) => {
    if (err) {
      fs.readFile(path.join(ROOT, '404.html'), (err404, body404) => {
        if (err404) {
          send(res, 404, 'Not found');
          return;
        }
        send(res, 404, body404, { 'Content-Type': 'text/html; charset=utf-8' });
      });
      return;
    }
    const type = MIME[path.extname(file).toLowerCase()] || 'application/octet-stream';
    send(res, 200, data, { 'Content-Type': type });
  });
}).listen(PORT, () => {
  console.log(`\n🖥️  Frontend at http://localhost:${PORT}\n`);
});
