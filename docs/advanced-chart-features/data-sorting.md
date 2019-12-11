Data sorting
===

Highcharts 8 introduces a possibility of presenting data in ascending or descending order. This concept in a simple way allows to distinguish points with the highest or lowest values, which is very useful for dynamic data. The whole functionality is based on setting the increasing `x` property for points according to their value defined in `sortKey` option. The order of points in an array is unchanged.

Installation
------------

Data sorting is implemented in the Highcharts core and do not require any additional modules.
To use this feature set `dataSorting.enabled` to `true` on a series level.

Configuration
-------------

To manipulate the order of sorting use `xAxis.reversed` option.

Below code in a simple way presents how `dataSorting` works:

**Default `y` sortKey:**

    series: [{
        dataSorting: {
            enabled: true
        },
        data: [5, 12, 4, 10]
    }]

The data will be internally converted to:

    [{ y: 5, x: 2}, { y: 12, x: 0}, { y: 4, x: 3}, { y: 10, x: 1}]

**Defined custom `sortKey`**

    series: [{
        type: 'column',
        dataSorting: {
            enabled: true,
            sortKey: 'customValue'
        },
        data: [
            { y: 2, customValue: 7 },
            { y: 5, customValue: 10 },
            { y: 8, customValue: 1 }
        ]
    }]

The data will be internally converted to:

    data: [
        { y: 2, customValue: 7, x: 1 },
        { y: 5, customValue: 10, x: 0 },
        { y: 8, customValue: 1, x: 2 }
    ]

**Enabled `matchByName`**

In the example below the points will be matched by name in the update.

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

Use Cases
---------

**Sorting with `xAxis` labels animation and zones**

This feature provides a possibility to animate `xAxis` labels. If category `xAxis` type is used, `step` and `tickInterval` options are set to `1`, labels are matched by string and animated by swapping positions.

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

<iframe style="width: 100%; height: 450px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/datasorting/labels-animation allow="fullscreen"></iframe>

**Dependent sorting**

It is also possible to make the sorting of one series dependent on the other. If some series do not have defined individual `dataSorting` property and is linked to another with enabled `dataSorting`, the series points, regardless of their values will be matched by index and will have the same `x` value as the points from the master series.

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

<iframe style="width: 100%; height: 450px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/datasorting/dependent-sorting allow="fullscreen"></iframe>

API documentation
-----------------

Check the following [API document link](https://api.highcharts.com/highcharts/plotOptions.series.dataSorting) to learn more about the data sorting.
