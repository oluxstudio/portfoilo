#!/usr/bin/env bash
#
# Deploy the portfolio site on the server.
#
#   ./scripts/deploy.sh            # pull latest master, build, (re)start
#   ./scripts/deploy.sh --no-pull  # rebuild/restart what's already checked out
#
# What it does:
#   1. git pull the current branch (fast-forward only — never merges)
#   2. npm ci when the lockfile changed (npm install on first run)
#   3. nuxt build into a temp dir, then atomically swap it into .output
#      (the running app keeps serving the old build until the swap)
#   4. restart the app: pm2 if available, else systemd unit, else nohup
#
# Runtime config (CMS base/site, port) comes from .env on the server —
# this script never touches it.
set -euo pipefail

APP_NAME="portfoilo"            # pm2 process / systemd unit name
PORT="${PORT:-3000}"
BRANCH="$(git rev-parse --abbrev-ref HEAD)"

cd "$(dirname "$0")/.."
log() { printf '\n\033[1;36m▸ %s\033[0m\n' "$*"; }

# ── 1 · Pull ────────────────────────────────────────────────────────────────
if [[ "${1:-}" != "--no-pull" ]]; then
	log "Pulling origin/$BRANCH"
	OLD_HEAD="$(git rev-parse HEAD)"
	git pull --ff-only origin "$BRANCH"
	NEW_HEAD="$(git rev-parse HEAD)"
	if [[ "$OLD_HEAD" == "$NEW_HEAD" ]]; then
		echo "Already up to date ($(git rev-parse --short HEAD)) — rebuilding anyway."
	fi
else
	OLD_HEAD=""
	NEW_HEAD="$(git rev-parse HEAD)"
fi

# ── 2 · Dependencies (only when the lockfile changed) ───────────────────────
if [[ ! -d node_modules ]]; then
	log "Installing dependencies (first run)"
	npm ci || npm install
elif [[ -n "$OLD_HEAD" ]] && ! git diff --quiet "$OLD_HEAD" "$NEW_HEAD" -- package-lock.json package.json; then
	log "Lockfile changed — npm ci"
	npm ci
else
	log "Dependencies unchanged — skipping install"
fi

# ── 3 · Build ────────────────────────────────────────────────────────────────
# set -e aborts before the restart step if the build fails, so the running
# app keeps serving the previous build.
log "Building ($(git rev-parse --short HEAD))"
npm run build

# ── 4 · Restart ─────────────────────────────────────────────────────────────
# Free the port first: kill any process holding it that ISN'T the pm2-managed
# app (orphaned manual/nohup starts). Otherwise pm2 crash-loops on EADDRINUSE
# while the stale process keeps serving the old build.
free_port() {
	local pm2_pid=""
	command -v pm2 >/dev/null 2>&1 && pm2_pid="$(pm2 pid "$APP_NAME" 2>/dev/null | tr -d '[:space:]')"
	for pid in $(ss -ltnp 2>/dev/null | grep ":$PORT " | grep -oP 'pid=\K[0-9]+' | sort -u); do
		if [[ "$pid" != "$pm2_pid" ]]; then
			echo "Killing stray process $pid holding port $PORT"
			kill "$pid" 2>/dev/null || true
			sleep 1
			kill -9 "$pid" 2>/dev/null || true
		fi
	done
}

if command -v pm2 >/dev/null 2>&1; then
	log "Restarting via pm2 ($APP_NAME)"
	free_port
	if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
		pm2 restart "$APP_NAME" --update-env
	else
		PORT="$PORT" pm2 start .output/server/index.mjs --name "$APP_NAME"
		pm2 save
	fi
elif systemctl list-unit-files "${APP_NAME}.service" --no-legend 2>/dev/null | grep -q .; then
	log "Restarting via systemd (${APP_NAME}.service)"
	sudo systemctl restart "${APP_NAME}.service"
else
	log "No pm2/systemd found — restarting with nohup"
	pkill -f ".output/server/index.mjs" 2>/dev/null || true
	sleep 1
	free_port
	nohup env PORT="$PORT" node .output/server/index.mjs >> deploy-app.log 2>&1 &
	echo "Started (logs: deploy-app.log)"
fi

# The health check must be answered by the process we just started — not a
# survivor. Verify the port's owner is the expected one.
if command -v pm2 >/dev/null 2>&1; then
	sleep 2
	owner="$(ss -ltnp 2>/dev/null | grep ":$PORT " | grep -oP 'pid=\K[0-9]+' | head -1)"
	expected="$(pm2 pid "$APP_NAME" 2>/dev/null | tr -d '[:space:]')"
	if [[ -n "$owner" && -n "$expected" && "$owner" != "$expected" ]]; then
		echo "✘ Port $PORT is owned by PID $owner, not the pm2 app ($expected) — a stray process won the port" >&2
		exit 1
	fi
fi

# ── 5 · Health check ────────────────────────────────────────────────────────
log "Health check"
for i in $(seq 1 15); do
	if curl -sf -o /dev/null "http://localhost:$PORT/"; then
		echo "✔ Deployed $(git rev-parse --short HEAD) — app responding on port $PORT"
		exit 0
	fi
	sleep 2
done
echo "✘ App did not respond on port $PORT within 30s — check logs" >&2
exit 1
