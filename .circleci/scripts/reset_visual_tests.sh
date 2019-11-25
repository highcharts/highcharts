#!/usr/bin/env bash
set -e

TESTS=""
TOKEN=""
BRANCH="master"

for i in "$@"
do
case $i in
    -t=*|--tests=*)
    TESTS="${i#*=}"
    ;;
    -b=*|--branch=*)
    BRANCH="${i#*=}"
    ;;
      -t=*|--token=*)
    TOKEN="${i#*=}"
    ;;
    *)
     # unknown option
    ;;
esac
done

if [[ -z $TESTS ]]; then
  echo "Please specify test path(s) to reset to using --tests=<your.testpath.a,your.testpath.b> argument."
  exit 1;
fi

if [[ -z $TOKEN ]]; then
  echo "Please specify CirleCI API token to trigger the CI job as using --token=<token> argument."
  exit 1;
fi

echo "Triggering reset visual tests job on CircleCI using branch ${BRANCH}.."
# Circle API v2

httpUrl="https://circleci.com/api/v2/project/github/highcharts/highcharts/pipeline?circle-token=${TOKEN}&branch=${BRANCH}"
payload="{ \"branch\":\"${BRANCH}\", \"parameters\": { \"run_reset_tests\": true, \"reset_tests\": \"${TESTS}\" }}"
echo "$payload"

rep=$(curl -fv -X POST -H "Content-Type: application/json" -d "$payload" "$httpUrl")
status="$?"
echo "$rep"
exit "$status"
