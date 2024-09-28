This folder contains the public page(s) visible at [code.highcharts.com](https://code.highcharts.com)

To update the page, use the [AWS CLI](https://aws.amazon.com/cli/), and the following command:
```sh
aws s3 cp ./www/ s3://{bucket-goes-here} \
--recursive \
--exclude README.md \
--acl public-read \
--dryrun # for testing
```
