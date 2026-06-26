#!/usr/bin/env bash
#
# Decide whether the cached benchmark base results fetched from S3 are
# sufficient, or whether the workflow must fall back to building the base
# from master.
#
# For the given category it compares the list of benchmarks that will run
# (the *.bench.ts files) against the base result JSON files that were
# fetched into tmp/benchmarks/base/<category>/. If any benchmark is missing
# a corresponding base result, it requests the master fallback.
#
# Usage: checkBenchmarkBase.sh <category>
# Sets the GitHub Actions output `need_master` to "true" or "false".

set -euo pipefail

CATEGORY="${1:?Usage: checkBenchmarkBase.sh <category>}"

BENCH_DIR="test/ts-node-unit-tests/benchmarks/${CATEGORY}"
BASE_DIR="tmp/benchmarks/base/${CATEGORY}"

need_master=false

# No benchmarks to run at all: nothing to compare, no fallback needed.
shopt -s nullglob
bench_files=("${BENCH_DIR}"/*.bench.ts)
shopt -u nullglob

if [ ${#bench_files[@]} -eq 0 ]; then
  echo "No benchmarks found in ${BENCH_DIR}; skipping master fallback."
else
  for bench in "${bench_files[@]}"; do
    name="$(basename "${bench}" .bench.ts)"
    if [ ! -f "${BASE_DIR}/${name}.json" ]; then
      echo "Missing cached base result for ${CATEGORY}/${name}; master fallback required."
      need_master=true
    fi
  done

  if [ "${need_master}" = false ]; then
    echo "All cached base results present for ${CATEGORY}; using cached baseline."
  fi
fi

echo "need_master=${need_master}" >> "${GITHUB_OUTPUT}"
