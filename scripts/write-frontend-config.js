# Writes frontend/config.js from BACKEND_URL (used by Netlify builds).
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
