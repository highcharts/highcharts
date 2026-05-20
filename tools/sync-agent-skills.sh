#!/usr/bin/env bash
set -euo pipefail

src='.agents/skills'
dest='.claude/skills'
assume_yes=0

if [[ "${1:-}" == '--yes' ]]; then
  assume_yes=1
fi

if [[ ! -d "$src" ]]; then
  echo "Missing source directory: $src" >&2
  exit 1
fi

mkdir -p "$dest"

# Remove stale entries in destination before copying.
if [[ "$(find "$dest" -mindepth 1 -maxdepth 1 | wc -l)" -gt 0 ]]; then
  if [[ "$assume_yes" -ne 1 ]]; then
    if [[ ! -t 0 ]]; then
      echo "Refusing to replace $dest without confirmation in non-interactive mode. Re-run with --yes." >&2
      exit 1
    fi

    read -r -p "This will replace contents of $dest. Continue? [y/N] " reply
    case "$reply" in
      [yY] | [yY][eE][sS]) ;;
      *)
        echo "Aborted."
        exit 0
        ;;
    esac
  fi

  find "$dest" -mindepth 1 -maxdepth 1 -exec rm -rf {} +
fi

cp -R "$src"/. "$dest"/

echo "Synced $src -> $dest"
