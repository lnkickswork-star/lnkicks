#!/bin/bash
cd /home/z/my-project
# Kill any old next dev instances
pkill -f "next dev" 2>/dev/null
pkill -f "next-server" 2>/dev/null
sleep 1
# Start dev server detached, logs to file
setsid nohup npm run dev > /home/z/my-project/scripts/dev.log 2>&1 < /dev/null &
disown
echo "Started. Waiting for ready..."
# Wait up to 30s for the server to bind to :3000
for i in $(seq 1 30); do
  if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ 2>/dev/null | grep -q "200\|307"; then
    echo "Server ready after ${i}s"
    break
  fi
  sleep 1
done
ss -tlnp 2>/dev/null | grep :3000 || echo "WARN: not listening on 3000"
echo "---LOG TAIL---"
tail -20 /home/z/my-project/scripts/dev.log
