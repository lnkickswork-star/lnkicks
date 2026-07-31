#!/bin/bash
cd /home/z/my-project
exec npm run dev > /home/z/my-project/logs/dev-server.log 2>&1
