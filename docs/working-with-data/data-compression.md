Data compression
===

The `data` option of a series supports [three basic ways](https://www.highcharts.com/docs/chart-concepts/series#the-data-in-a-series) of of providing data. However, Highcharts requires `x` values on a datetime axis to be given in JavaScript timestamps, which are milliseconds since 1970-01-01.

For a large time based dataset, passing individual `x` values over the network may represent a substantial amount of traffic. For example, a dataset with hourly values over a year (24 * 365 = 8760 x/y pairs), weighs 158 kB on the file system. It should be noted though that gzipping would chip off most of the repetetive parts of the timestamp in a typical web setup.

```js
data: [
    [1577836800000,1],
    [1577840400000,1],
    [1577844000000,1],
    [1577847600000,1],
    [1577851200000,1],
    [1577854800000,1],
    ...
]
```

#### Regular data
For regularly spaced data points, we don't need the X values at all. All we need to provide is the [pointStart](https://api.highcharts.com/highcharts/series.line.pointStart) and [pointInterval](https://api.highcharts.com/highcharts/series.line.pointInterval) options, and the X values will be computed from there. Supplemented with a [pointIntervalUnit](https://api.highcharts.com/highcharts/series.line.pointIntervalUnit), the X data will also handle the irregular time intervals that emerge in a local timezone when crossing over the Daylight Saving Time boundaries. Our data set is now down to 18 kB.

```js
data: [1, 1, 1, 1, 1, 1, ...]
pointStart: 1577836800000, // Date.UTC(2020, 0, 1)
pointInterval: 36e5, // one hour
```

[View live demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/series-pointstart-datetime/)

#### Irregular data
But those simplified settings won't work when the X values are irregular. Since v9.1.2, the [relativeXValue](https://api.highcharts.com/highcharts/series.line.relativeXValue) option is available. This allows us to redefine what the `x` value means, so that it is first multiplied by `pointInterval` (and respecting `pointIntervalUnit`), then `pointStart` is added to it. As a result, we can compress any X values by the `f(x) = ax + b` formula where `a` = `pointInterval` and `b` = `pointStart`. Non-datetime X values can also be compressed this way. Our data set is now 78 kB, but can express irregularly spaced X values.

```js
data: [
    [0,1],
    [1,1],
    [2,1],
    [3,1],
    [4,1],
    [5,1],
    ...
],
pointStart: 1577836800000, // Date.UTC(2020, 0, 1)
pointInterval: 36e5, // one hour
relativeXValue: true
```

[View live demo of relativeXValue](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/series-relativexvalue/)

