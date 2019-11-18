#!/usr/bin/env bash
set -e

# latest commit
LATEST_COMMIT=$(git rev-parse HEAD)
BUCKET=""
TOKEN=""

for i in "$@"
do
case $i in
    -b=*|--bucket=*)
    BUCKET="${i#*=}"
    ;;
      -t=*|--token=*)
    TOKEN="${i#*=}"
    ;;
    *)
     # unknown option
    ;;
esac
done

if [[ -z $BUCKET ]]; then
  echo "Please specify bucket to deploy to using --bucket=<your.bucket> argument."
  exit 1;
fi

if [[ -z $TOKEN ]]; then
  echo "Please specify CirleCI API token to deploy to using --token=<token> argument."
  exit 1;
fi

# latest commit where docs/ was changed
DOCS_COMMIT=$(git log -1 --format=format:%H --full-diff docs/)

if [ $DOCS_COMMIT = $LATEST_COMMIT ]; then
    echo "Files in docs/ has changed, triggering deploy of docs via doc-builder to bucket ${BUCKET}"
    payload="{ \"branch\":\"master\", \"parameters\": { \"run_deploy\": true, \"target_bucket\": \"${BUCKET}\" }}"
    echo "$payload"

    # Circle API v2
    httpUrl="https://circleci.com/api/v2/project/github/highcharts/doc-builder/pipeline?circle-token=${TOKEN}&branch=master"
    rep=$(curl -f -X POST -H "Content-Type: application/json" -d "$payload" "$httpUrl")
    status="$?"
    echo "$rep"
    exit "$status"

else
     echo "No change in docs/ folder found."
     exit 0;
fi
