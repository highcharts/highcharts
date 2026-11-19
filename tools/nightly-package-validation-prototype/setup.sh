#!/usr/bin/env bash
set -euo pipefail

if [[ "${1:-}" == --help ]]; then
    printf 'Usage: bash setup.sh <pack|grid-build|grid-pack|chromium>\n'
    exit 0
fi

evidence="$RUNNER_TEMP/package-validation"

check_npm() {
    actual_npm=$(npm --version)
    if [[ "$actual_npm" != 11.20.0 ]]; then
        printf 'Expected npm 11.20.0, found %s\n' "$actual_npm" >&2
        return 1
    fi
}

stage_candidate() {
    consumer=$(mktemp -d "$evidence/$2-package-prototype-XXXXXX")
    mkdir "$consumer/candidate"
    mv -- "$1" "$consumer/candidate/candidate.tgz"
}

prepare() {
    prototype="$GITHUB_WORKSPACE/tools/nightly-package-validation-prototype"
    distribution="$RUNNER_TEMP/assembled-distribution"
    cd "$evidence"
    check_npm
    node "$prototype/distribution.mjs" verify "$distribution" build-manifest.json
    npm pack "$distribution" --ignore-scripts --json > pack.json
    node "$prototype/distribution.mjs" verify "$distribution" build-manifest.json
    if ! tarball=$(jq -er '.[0] | select(.name == "highcharts") | .filename' pack.json); then
        printf 'Error: npm pack did not report a Highcharts tarball\n' >&2
        return 1
    fi
    stage_candidate "$tarball" highcharts
    cp -- build-manifest.json pack.json "$consumer/candidate/"
    node "$prototype/package-evidence.mjs" "$consumer" highcharts
    sha256sum build-manifest.json "${consumer#"$evidence"/}/candidate/candidate.tgz" > SHA256SUMS
    printf 'consumer=%s\n' "$consumer" >> "$GITHUB_OUTPUT"
}

prepare_grid_lite() {
    local -a args=("$GITHUB_SHA" "$PWD" "$GITHUB_WORKSPACE/grid-lite-dist"
        "$GRID_LITE_METADATA_SHA" "$RUNNER_TEMP/grid-lite-staging")
    if [[ "${GRID_LITE_MISSING_CSS:-false}" == true ]]; then
        args+=(--missing-css)
    fi
    check_npm
    node tools/nightly-package-validation-prototype/stage-grid-lite.mjs "${args[@]}" \
        > "$evidence/staging.json"
    local tarball
    tarball=$(jq -er '.tarball' "$evidence/staging.json")
    cp -- "$RUNNER_TEMP/grid-lite-staging/staging-manifest.json" "$evidence/"
    stage_candidate "$tarball" grid-lite
    cp -- "$evidence/staging-manifest.json" "$consumer/candidate/"
    node tools/nightly-package-validation-prototype/package-evidence.mjs "$consumer" @highcharts/grid-lite
    printf 'consumer=%s\n' "$consumer" >> "$GITHUB_OUTPUT"
}

if [[ "${1:-}" == run ]]; then
    case "$2" in
        pack) prepare ;;
        grid-build)
            check_npm
            npm ci
            npx gulp dist --product Grid --skip-dist-compress
            ;;
        grid-pack) prepare_grid_lite ;;
        chromium)
            cd "$evidence"
            npm exec --yes --package=@playwright/test@1.61.1 -- \
                playwright install --with-deps --only-shell chromium
            ;;
        *) exit 2 ;;
    esac
    exit
fi

case "${1:-}" in
    pack|grid-build|grid-pack|chromium) ;;
    *) printf 'Usage: bash setup.sh <pack|grid-build|grid-pack|chromium>\n'; exit 2 ;;
esac
log="$evidence/setup-$1.log"
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
        /error TS[0-9]+:|AssertionError|Error:|^npm error |^jq:|^mv:|Expected npm|failed|not found|No such file/ {
            print; found = 1; exit
        }
        NF && !fallback { fallback = $0 }
        END { if (!found) print fallback }
    ' "$log" | tr -d '\r' | cut -c1-500)
    printf 'diagnostic=%s\n' "${diagnostic:-Setup command exited with status $result}" >> "$GITHUB_OUTPUT"
fi
exit "$result"
