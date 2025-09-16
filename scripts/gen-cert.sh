#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

: "${LAN_IP:?Set LAN_IP in .env or export LAN_IP=...}"

mkdir -p certs
rm -f certs/cert.pem certs/key.pem

echo "Generating self-signed cert for IP: $LAN_IP"
openssl req -x509 -nodes -days 825 -newkey rsa:2048 \
  -keyout certs/key.pem -out certs/cert.pem \
  -subj "/CN=$LAN_IP" \
  -addext "subjectAltName = IP:$LAN_IP"

echo "certs created at certs/cert.pem and certs/key.pem"
