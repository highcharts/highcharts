#!/usr/bin/env bash
set -euo pipefail

prepare() {
    prototype="$GITHUB_WORKSPACE/tools/nightly-package-validation-prototype"
    distribution="$RUNNER_TEMP/assembled-distribution"
    cd "$RUNNER_TEMP/package-validation"
    actual_npm=$(npm --version)
    if [[ "$actual_npm" != 11.20.0 ]]; then
        printf 'Expected npm 11.20.0, found %s\n' "$actual_npm" >&2
        return 1
    fi
    node "$prototype/distribution.mjs" verify "$distribution" build-manifest.json
    npm pack "$distribution" --ignore-scripts --json > pack.json
    node "$prototype/distribution.mjs" verify "$distribution" build-manifest.json
    if ! tarball=$(jq -er '.[0] | select(.name == "highcharts") | .filename' pack.json); then
        printf 'Error: npm pack did not report a Highcharts tarball\n' >&2
        return 1
    fi
    mv -- "$tarball" candidate.tgz
    sha256sum build-manifest.json candidate.tgz > SHA256SUMS
}

if [[ "${1:-}" == run ]]; then
    case "$2" in
        pack) prepare ;;
        chromium)
            cd "$RUNNER_TEMP/package-validation"
            npm exec --yes --package=@playwright/test@1.61.1 -- \
                playwright install --with-deps --only-shell chromium
            ;;
        *) exit 2 ;;
    esac
    exit
fi

case "${1:-}" in
    pack|chromium) ;;
    --help) printf 'Usage: bash setup.sh <pack|chromium>\n'; exit 0 ;;
    *) printf 'Usage: bash setup.sh <pack|chromium>\n'; exit 2 ;;
esac
log="$RUNNER_TEMP/package-validation/setup-$1.log"
mkdir -p "$(dirname "$log")"
set +e
bash "$0" run "$1" 2>&1 | tee "$log"
statuses=("${PIPESTATUS[@]}")
result=${statuses[0]}
if (( result == 0 )); then result=${statuses[1]}; fi
set -e
if (( result != 0 )); then
    diagnostic=$(awk '
        /Failed to install browsers/ && !fallback { fallback = $0; next }
        /^npm error (code|path|command|A complete log)( |$)/ { next }
        /AssertionError|Error:|^npm error |^jq:|^mv:|Expected npm|failed|not found|No such file/ {
            print; found = 1; exit
        }
        NF && !fallback { fallback = $0 }
        END { if (!found) print fallback }
    ' "$log" | tr -d '\r' | cut -c1-500)
    printf 'diagnostic=%s\n' "${diagnostic:-Setup command exited with status $result}" >> "$GITHUB_OUTPUT"
fi
exit "$result"
