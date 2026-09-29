// Writes frontend/config.js from BACKEND_URL (used by Netlify builds).
// The sitemap always uses the canonical production hostname, including on branch deploys.
const fs = require('fs');
const path = require('path');

const raw = (process.env.BACKEND_URL || '').trim().replace(/\/$/, '');
const backend = raw || 'https://web-cam-monkey.onrender.com';
const out = path.join(__dirname, '..', 'frontend', 'config.js');
const contents =
  'window.APP_CONFIG = {\n' +
  `  BACKEND_URL: ${JSON.stringify(backend)},\n` +
  '};\n';

fs.writeFileSync(out, contents);
console.log('Wrote', out, 'BACKEND_URL=', backend);

const site = (process.env.CANONICAL_SITE_URL || 'https://monkey-webcam.netlify.app').trim().replace(/\/+$/, '');
if (site) {
  const pages = [
    ['/', 'daily', '1.0'],

    ['/about.html', 'monthly', '0.8'],
    ['/how-it-works.html', 'monthly', '0.8'],
    ['/safety.html', 'monthly', '0.8'],
    ['/guidelines.html', 'monthly', '0.7'],
    ['/faq.html', 'weekly', '0.8'],
    ['/blog.html', 'weekly', '0.8'],
    ['/webcam-chat-safety.html', 'monthly', '0.7'],
    ['/webcam-chat-camera-setup.html', 'monthly', '0.7'],
    ['/peer-to-peer-video-chat.html', 'monthly', '0.7'],
    ['/cookie-policy.html', 'yearly', '0.5'],
    ['/privacy.html', 'yearly', '0.5'],
    ['/terms.html', 'yearly', '0.5'],
    ['/contact.html', 'yearly', '0.6'],
  ];
  const urls = pages
    .map(([loc, freq, pri]) => {
      const href = loc === '/' ? site + '/' : site + loc;
      return `  <url>\n    <loc>${href}</loc>\n    <changefreq>${freq}</changefreq>\n    <priority>${pri}</priority>\n  </url>`;
    })
    .join('\n');
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls +
    '\n</urlset>\n';
  const sm = path.join(__dirname, '..', 'frontend', 'sitemap.xml');
  fs.writeFileSync(sm, xml);
  console.log('Wrote', sm, 'SITE=', site);
}
