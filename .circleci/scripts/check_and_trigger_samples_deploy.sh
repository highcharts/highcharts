#!/usr/bin/env bash
set -e

# latest commit
LATEST_COMMIT=$(git rev-parse HEAD)
BUCKET=""
TOKEN=""
FORCE_DEPLOY=false
THUMBNAILS=false

for i in "$@"
do
case $i in
    -b=*|--bucket=*)
    BUCKET="${i#*=}"
    ;;
      -t=*|--token=*)
    TOKEN="${i#*=}"
    ;;
      -f|--force-deploy)
    FORCE_DEPLOY=true
    ;;
      --thumbnails)
    THUMBNAILS=true
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

# latest commit where samples were changed, limited to 24 hours
SAMPLES_COMMIT=$(git log -1 -- --since=\"24 hours ago\" --format=format:%H --full-diff --name-status samples/)
DEMOS_COMMIT=$(git log -1 -- --since=\"24 hours ago\" --format=format:%H --full-diff --name-status samples/\*/demo/\*)q

if [[ $(echo $SAMPLES_COMMIT | wc -l) -ge 2 ]] || [ "$FORCE_DEPLOY" = true ]; then
    echo "Force deployed: ${FORCE_DEPLOY}"
    echo "Files in samples/ has changed or forcing deploy. Triggering deploy of samples via highcharts-demo-manager to bucket ${BUCKET}"
    payload="{ \"branch\":\"master\", \"parameters\": { \"deploy_samples\": true, \"target_bucket\": \"${BUCKET}\", \"deploy_args\": \"-dryrun\" }}"
    echo "$payload"

    # Circle API v2
    httpUrl="https://circleci.com/api/v2/project/github/highcharts/highcharts-demo-manager/pipeline?circle-token=${TOKEN}&branch=master"
    rep=$(curl -f -X POST -H "Content-Type: application/json" -d "$payload" "$httpUrl")
    status="$?"
    echo "$rep"
    exit "$status"

else
     echo "No change in samples/ folder found."
     exit 0;
fi

# Handle demos
if [[ $(echo $DEMOS_COMMIT | wc -l) -ge 2 ]] || [ "$FORCE_DEPLOY" = true  ]; then
    echo "Force deployed: ${FORCE_DEPLOY}"
    echo "Found changes in demos"
    # Check if there are any [A]dded demo files, build thumbnails if that is the case
	  NEW_FILES=$(echo $DEMOS_COMMIT | egrep -c "^A\s+samples\/.+\/demo\/*\.details")
    if [[ $NEW_FILES -ge 1 ]]; then
      THUMBNAILS=true
    fi

    echo "Files in samples/ has changed or forcing deploy. Triggering deploy of demos via highcharts-demo-manager to bucket ${BUCKET}"
    payload="{ \"branch\":\"master\", \"parameters\": { \"deploy_demos\": true, \"deploy_thumbnails\": ${THUMBNAILS}, \"target_bucket\": \"${BUCKET}\", \"deploy_args\": \"-dryrun\" }}"
    echo "$payload"

    # Circle API v2
    httpUrl="https://circleci.com/api/v2/project/github/highcharts/highcharts-demo-manager/pipeline?circle-token=${TOKEN}&branch=master"
    rep=$(curl -f -X POST -H "Content-Type: application/json" -d "$payload" "$httpUrl")
    status="$?"
    echo "$rep"
    exit "$status"

else
     echo "No change in samples/*/demo/ folder found."
     exit 0;
fi
