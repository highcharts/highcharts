#!/usr/bin/env bash
set -euo pipefail

src='.agents/skills'
dest='.claude/skills'

if [[ ! -d "$src" ]]; then
  echo "Missing source directory: $src" >&2
  exit 1
fi

mkdir -p "$dest"

# Remove stale entries in destination before copying.
find "$dest" -mindepth 1 -maxdepth 1 -exec rm -rf {} +
cp -R "$src"/. "$dest"/

echo "Synced $src -> $dest"
