# Writes frontend/config.js from BACKEND_URL (used by Netlify builds).
const fs = require('fs');
const path = require('path');

const raw = (process.env.BACKEND_URL || '').trim().replace(/\/$/, '');
const onNetlify = process.env.NETLIFY === 'true' || process.env.CONTEXT;

if (onNetlify && !raw) {
  console.error(
    'Set BACKEND_URL in Netlify Site settings → Environment variables.\n' +
      'Use your Render URL, e.g. https://monkey-videochat.onrender.com'
  );
  process.exit(1);
}

const backend = raw || 'http://localhost:3000';
const out = path.join(__dirname, '..', 'frontend', 'config.js');
const contents =
  'window.APP_CONFIG = {\n' +
  `  BACKEND_URL: ${JSON.stringify(backend)},\n` +
  '};\n';

fs.writeFileSync(out, contents);
console.log('Wrote', out, 'BACKEND_URL=', backend);
