#!/usr/bin/env bash
set -e

TESTS="unit-tests/time/*"
BROWSER="ChromeHeadless"

for i in "$@"
do
case $i in
    -t=*|--tests=*)
    TESTS="${i#*=}"
    ;;
    -b=*|--splitbrowsers=*)
    BROWSER="${i#*=}"
    ;;
    *)
     # unknown option
    ;;
esac
done

SCRIPTS_DIR="$(pwd)/.github/scripts"

echo "Triggering timezone tests.."

orig_timezone=$(cat /etc/timezone || node -e "require('$SCRIPTS_DIR/print_timezone.js').timezone()")

echo "Original timezone: $orig_timezone"

trap "sudo ln -sf /usr/share/zoneinfo/${orig_timezone} /etc/localtime && export TZ=${orig_timezone}" EXIT

TZ_TESTS=("Australia/Melbourne" "America/Los_Angeles" "Asia/Kolkata" "UTC" "Atlantic/Reykjavik" "Pacific/Fiji")

for tz in "${TZ_TESTS[@]}"
do
    export TZ=$tz
    sudo ln -sf /usr/share/zoneinfo/$tz /etc/localtime && node -e "require('$SCRIPTS_DIR/print_timezone.js').timezone()"
    npx karma start test/karma-conf.js --single-run --splitbrowsers ${BROWSER} --browsercount 1 --tests unit-tests/time/* --timezone $tz
done

