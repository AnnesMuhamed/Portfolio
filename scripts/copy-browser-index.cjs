'use strict';

const fs = require('fs');
const path = require('path');

const browserDir = path.join(__dirname, '..', 'dist', 'portfolio', 'browser');
const src = path.join(browserDir, 'index.csr.html');
const dest = path.join(browserDir, 'index.html');

if (!fs.existsSync(src)) {
  console.error('copy-browser-index: missing', src);
  process.exit(1);
}

fs.copyFileSync(src, dest);
console.log('copy-browser-index: index.csr.html -> index.html');
