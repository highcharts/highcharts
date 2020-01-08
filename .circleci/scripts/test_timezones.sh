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


echo "Triggering timezone tests.."

orig_timezone=$(cat /etc/timezone)
trap "sudo ln -sf /usr/share/zoneinfo/${orig_timezone} /etc/localtime && export TZ=${orig_timezone}" EXIT

export TZ=Australia/Melbourne
sudo ln -sf /usr/share/zoneinfo/Australia/Melbourne /etc/localtime && node -e 'require("./.circleci/scripts/print_timezone.js").timezone()'
npx karma start test/karma-conf.js --single-run --splitbrowsers ${BROWSER} --browsercount 1 --tests unit-tests/time/* --timezone Australia/Melbourne

export TZ=America/Los_Angeles
sudo ln -sf /usr/share/zoneinfo/America/Los_Angeles /etc/localtime && node -e 'require("./.circleci/scripts/print_timezone.js").timezone()'
npx karma start test/karma-conf.js --single-run --splitbrowsers ${BROWSER} --browsercount 1 --tests unit-tests/time/* --timezone America/Los_Angeles

export TZ=Asia/Kolkata
sudo ln -sf /usr/share/zoneinfo/Asia/Kolkata /etc/localtime && node -e 'require("./.circleci/scripts/print_timezone.js").timezone()'
npx karma start test/karma-conf.js --single-run --splitbrowsers ${BROWSER} --browsercount 1 --tests unit-tests/time/* --timezone Asia/Kolkata

export TZ=UTC
sudo ln -sf /usr/share/zoneinfo/UTC /etc/localtime && node -e 'require("./.circleci/scripts/print_timezone.js").timezone()'
npx karma start test/karma-conf.js --single-run --splitbrowsers ${BROWSER} --browsercount 1 --tests unit-tests/time/* --timezone UTC

export TZ=Atlantic/Reykjavik
sudo ln -sf /usr/share/zoneinfo/Atlantic/Reykjavik /etc/localtime && node -e 'require("./.circleci/scripts/print_timezone.js").timezone()'
npx karma start test/karma-conf.js --single-run --splitbrowsers ${BROWSER} --browsercount 1 --tests unit-tests/time/* --timezone Atlantic/Reykjavik

export TZ=Pacific/Fiji
sudo ln -sf /usr/share/zoneinfo/Pacific/Fiji /etc/localtime && node -e 'require("./.circleci/scripts/print_timezone.js").timezone()'
npx karma start test/karma-conf.js --single-run --splitbrowsers ${BROWSER} --browsercount 1 --tests unit-tests/time/* --timezone Pacific/Fiji

