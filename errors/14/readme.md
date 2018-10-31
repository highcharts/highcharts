# String value sent to series.data, expected Number

This happens if you pass in a string as a data point, for example in a setup
like this:

```js
series: [{
    data: ["3", "5", "1", "6"]
}]
```

Highcharts expects the data values to be numbers. The most common reason for
this is that data is parsed from CSV or from a XML source, and the implementer
forgot to run `parseFloat` on the parsed value.

Note: For performance reasons internal type casting is not performed, and only
the first value is checked (since 2.3).
