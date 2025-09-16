#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# Load LAN_IP from .env if not already exported
if [[ -z "${LAN_IP:-}" ]]; then
  if [[ -f ".env" ]]; then
    # shellcheck disable=SC2046
    export $(grep -E '^(LAN_IP|PORT|API_TARGET)=' .env | xargs) || true
  fi
fi

# Require LAN_IP
: "${LAN_IP:?Set LAN_IP in .env or export LAN_IP=...}"

# Basic IPv4 sasnity check (prevents '... ( MODIFY )' accidents)
if ! [[ "$LAN_IP" =~ ^([0-9]{1,3}\.){3}[0-9]{1,3}$ ]]; then
  echo "❌ LAN_IP '$LAN_IP' is not a valid IPv4 address. Edit .env and try again."
  exit 1
fi

mkdir -p certs
rm -f certs/cert.pem certs/key.pem

echo "Generating self-signed cert for IP: $LAN_IP"
# macOS & modern OpenSSL support -addext
openssl req -x509 -nodes -days 825 -newkey rsa:2048 \
  -keyout certs/key.pem -out certs/cert.pem \
  -subj "/CN=$LAN_IP" \
  -addext "subjectAltName = IP:$LAN_IP"

echo "certs created:"
echo "   - certs/cert.pem"
echo "   - certs/key.pem"
