Data sorting
===

Highcharts 8 introduces a possibility of presenting data in ascending or
descending order. This concept, in a simple way, allows distinguishing points
with the highest or lowest values, which is very useful for dynamic data. The
whole functionality is based on setting the increasing `x` property for points
according to their value defined in the `sortKey` option. The order of points in
the data array is unchanged.

Installation
------------

Since v13, the data sorting functionality requires a separate module. To use the
module, include it after the `highcharts.js` file.

    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/data-sorting.js"></script>

To enable the feature, set `dataSorting.enabled` to `true` on the series level.

Configuration
-------------

To manipulate the order of sorting (ascending or descending), use the
`xAxis.reversed` option. By default, points are sorted descending.

The code below presents in a simple way how `dataSorting` works:

**Default `y` sortKey:**

```js
series: [{
    dataSorting: {
        enabled: true
    },
    data: [5, 12, 4, 10]
}]
```

The data will be internally converted to:

```js
[{ y: 5, x: 2}, { y: 12, x: 0}, { y: 4, x: 3}, { y: 10, x: 1}]
```

**Defined custom `sortKey`**

```js
series: [{
    type: 'column',
    dataSorting: {
        enabled: true,
        sortKey: 'custom.value'
    },
    data: [
        { y: 2, custom: { value: 7 } },
        { y: 5, custom: { value: 10 } },
        { y: 8, custom: { value: 1 } }
    ]
}]
```

The data will be internally converted to:

```js
data: [
    { y: 2, custom: { value: 7 }, x: 1 },
    { y: 5, custom: { value: 10 }, x: 0 },
    { y: 8, custom: { value: 1 }, x: 2 }
]
```

**Enabled `matchByName`**

In the example below the points will be matched by name in the update.

```js
var chart = Highcharts.chart('container', {
    xAxis: {
        type: 'category'
    },
    series: [{
        type: 'column',
        dataSorting: {
            enabled: true,
            matchByName: true
        },
        data: [
            ['one', 5],
            ['two', 10]
        ]
    }]
});

setTimeout(function() {
    chart.series[0].setData([
        ['two', 15],
        ['one', 11]
    ]);
}, 2000);
```

Use Cases
---------

**Sorting with `xAxis` labels animation and zones**

This feature provides a possibility to animate `xAxis` labels. If category `xAxis` type is used, `step` and `tickInterval` options are set to `1`, labels are matched by string and animated by swapping positions.

```js
{
    series: [{
        zoneAxis: 'x',
        zones: [{
            value: 1,
            color: '#ff4d40'
        }],
        dataLabels: {
            enabled: true,
            format: '{y:,.2f}'
        },
        dataSorting: {
            enabled: true
        },
        data: [...]
    }]
}
```

<iframe style="width: 100%; height: 450px; border: none;" src="https://www.highcharts.com/samples/embed/highcharts/datasorting/labels-animation" allow="fullscreen"></iframe>

**Dependent sorting**

It is also possible to make the sorting of one series dependent on another series (master series).
If a `dataSorting` property is defined in the master series but not in the other series, then the series points, regardless of their values, are matched by index, and they will have the same `x` value as the points from the master series.

```js
{
    series: [{
        id: 'mainSeries',
        dataSorting: {
            enabled: true,
            sortKey: 'value'
        },
        data: [...]
    }, {
        linkedTo: 'mainSeries',
        data: [...]
    }, {
        linkedTo: 'mainSeries',
        data: [...]
    }, {
        linkedTo: 'mainSeries',
        data: [...]
    }]
}
```

<iframe style="width: 100%; height: 450px; border: none;" src="https://www.highcharts.com/samples/embed/highcharts/datasorting/dependent-sorting" allow="fullscreen"></iframe>

API documentation
-----------------

Check the following [API document link](https://api.highcharts.com/highcharts/plotOptions.series.dataSorting) to learn more about the data sorting.
