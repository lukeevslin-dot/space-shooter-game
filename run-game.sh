#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="/Users/lukeevslin/Downloads/Legacy Collection"
GAME_DIR="$ROOT_DIR/game"
PORT="${1:-8080}"

echo "Starting Space Shooter at http://localhost:$PORT ..."
open "http://localhost:$PORT"
exec ruby -run -e httpd "$GAME_DIR" -p "$PORT"
