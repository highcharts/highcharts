# Sample data folder

## How to set up sample data

Our samples serve different purposes. They must run on jsFiddle, in our local test utils, on CircleCI and on our website. The best way to achieve this currently is by storing data files in this folder, then serving it through jsDelivr. In order to do that, we must first commit the data file, then use the latest commit hash in the reference to jsDelivr, which will load it from GitHub and cache it.

1. Add your data file to the `/samples/data/` folder.
2. Now in `http(s)://utils.highcharts.local/samples`, test that your sample works with the data file, by using a file URL like this: `https://cdn.jsdelivr.net/gh/highcharts/highcharts@sha/samples/data/{filename}`.
3. If it works like expected, commit the changes. Now this works in the utils because it dynamically rewrites the URL to load the local data file. If we try to run this on jsFiddle or our website, however, this will fail. So what we need to do is to replace the `sha` part of the URL with the real sha or commit hash.
4. To find the abbreviated commit hash of step 3, run this command: `git log --format="%h" -n 1`. The result may look like `0002e9cd00`.
5. Copy this commit hash and replace the `sha` part of step 2 in your sample or multiple samples using the same data. The result may look like this: `https://cdn.jsdelivr.net/gh/highcharts/highcharts@0002e9cd00/samples/data/{filename}`.
6. Commit again. Now your sample should work in all scenarios.

## JSON comments

 * `aapl-c.json`, `aapl-ohlc.json`, `aapl-ohlcv.json` and `aapl-v.json`,
   `goog-c.json` and `msft-c.json`: Generated from Google Finance API.
 * `ohlc.json` and `ohlcv.json` exported from www.ducascopy.net.
 * `range.json` generated from http://vikjavev.no/ver/range.jsonp.php?year=2017.
