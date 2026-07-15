#!/bin/sh
set -e

# Compose / AWS: default 80. Override PORT if a reverse proxy maps another host port.
export PORT="${PORT:-80}"
# Docker Compose service hostname for the API container
export API_HOST="${API_HOST:-api:5001}"

# Optional wait so first requests don't 502 while API is still binding
API_NAME="${API_HOST%%:*}"
echo "Clinova web: waiting for API host '${API_NAME}' (target ${API_HOST})..."
i=0
while [ "$i" -lt 60 ]; do
  # Prefer TCP check if wget is available (nginx alpine)
  if wget -q -O /dev/null --timeout=2 "http://${API_HOST}/health" 2>/dev/null; then
    echo "Clinova web: API is reachable."
    break
  fi
  i=$((i + 1))
  if [ "$i" -eq 60 ]; then
    echo "Clinova web: warning — API not reachable after 60s; starting nginx anyway (lazy DNS)."
  fi
  sleep 1
done

envsubst '${API_HOST} ${PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# Drop default site if present
rm -f /etc/nginx/conf.d/default.conf.bak 2>/dev/null || true

exec nginx -g 'daemon off;'
