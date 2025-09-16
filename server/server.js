// HTTPS static site + /v1 proxy to llama.cpp (local HTTP)
// Uses self-signed certs in ./certs and env from .env
const fs = require('fs');
const path = require('path');
const https = require('https');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const security = require('./security');

const LAN_IP = process.env.LAN_IP || '127.0.0.1';
const PORT   = Number(process.env.PORT || 8443);
const API    = process.env.API_TARGET || 'http://127.0.0.1:8080';

const app = express();
security(app);

// static site (from /web)
app.use('/', express.static(path.join(__dirname, '..', 'web'), { extensions: ['html'] }));

// proxy /v1/* to llama.cpp server
app.use('/v1', createProxyMiddleware({
  target: API,
  changeOrigin: true,
  ws: true,
  pathRewrite: { '^/v1': '/v1' },
}));

// TLS
const keyPath  = path.join(__dirname, '..', 'certs', 'key.pem');
const certPath = path.join(__dirname, '..', 'certs', 'cert.pem');
if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
  console.error('❌ Missing certs. Run: npm run cert');
  process.exit(1);
}
const options = { key: fs.readFileSync(keyPath), cert: fs.readFileSync(certPath) };

// Bind 0.0.0.0 so it’s reachable via LAN_IP
https.createServer(options, app).listen(PORT, '0.0.0.0', () => {
  console.log('────────────────────────────────────────');
  console.log(` HTTPS up at:        https://${LAN_IP}:${PORT}`);
  console.log(` Open on phone:      https://${LAN_IP}:${PORT}/`);
  console.log(` API proxied via:    https://${LAN_IP}:${PORT}/v1/chat/completions`);
  console.log('────────────────────────────────────────\n');
  console.log('Tip: Start llama.cpp separately:');
  console.log('  llama-server --host 0.0.0.0 --port 8080 --jinja -hf ggml-org/SmolVLM-500M-Instruct-GGUF -ngl 99'); // You can run without --jinja 
});
