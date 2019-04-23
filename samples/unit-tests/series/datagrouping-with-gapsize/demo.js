QUnit.test('dataGrouping with gapSize (#7686)', function (assert) {
    var chart = Highcharts.stockChart('container', {
        chart: {
            height: 400,
            width: 600,
            margin: [40, 40, 40, 40]
        },
        rangeSelector: {
            enabled: false
        },
        navigator: {
            enabled: false
        },
        scrollbar: {
            enabled: false
        },
        xAxis: {
            minRange: 1
        },
        series: [{
            gapSize: 1,
            gapUnit: 'value',
            dataGrouping: {
                enabled: true,
                forced: true,
                units: [
                    [
                        'millisecond', [2]
                    ]
                ]
            },
            marker: {
                enabled: true
            },
            data: [{
                x: 0,
                y: 1
            }, {
                x: 1,
                y: 2
            }, {
                x: 2,
                y: 1
            }, {
                x: 5,
                y: 2
            }, {
                x: 6,
                y: 1
            }, {
                x: 7,
                y: 2
            }, {
                x: 10,
                y: 1
            }, {
                x: 11,
                y: 2
            }, {
                x: 12,
                y: 1
            }]
        }]
    });

    var series = chart.series[0];

    assert.strictEqual(
        series.graph.attr('d').lastIndexOf('L'),
        77,
        'Graph should be visible when dataGrouping is enabled'
    );

    chart.update({
        time: {
            timezone: 'Europe/Oslo',
            useUTC: false
        }
    });
    series.update({
        dataGrouping: {
            units: [
                [
                    'day', [1]
                ]
            ]
        },
        data: [
            [Date.UTC(2019, 9, 20), 1],
            [Date.UTC(2019, 9, 21), 1],
            [Date.UTC(2019, 9, 22), 1],
            [Date.UTC(2019, 9, 23), 1],
            [Date.UTC(2019, 9, 24), 1],
            [Date.UTC(2019, 9, 25), 1],
            [Date.UTC(2019, 9, 26), 1],
            [Date.UTC(2019, 9, 27), 1],
            [Date.UTC(2019, 9, 28), 1],
            [Date.UTC(2019, 9, 29), 1],
            [Date.UTC(2019, 9, 30), 1],
            [Date.UTC(2019, 9, 31), 1]
        ]
    });

    assert.strictEqual(
        series.graph.attr('d').lastIndexOf('M'),
        0,
        'Graph should be continuous when dataGrouping is days and crossing DST (#10000)'
    );

    series.update({
        dataGrouping: {
            units: [
                [
                    'month', [1]
                ]
            ]
        },
        data: [
            [Date.UTC(2019, 0, 1), 1],
            [Date.UTC(2019, 1, 1), 1],
            [Date.UTC(2019, 2, 1), 1],
            [Date.UTC(2019, 3, 1), 1],
            [Date.UTC(2019, 4, 1), 1],
            [Date.UTC(2019, 5, 1), 1],
            [Date.UTC(2019, 6, 1), 1],
            [Date.UTC(2019, 7, 1), 1],
            [Date.UTC(2019, 8, 1), 1],
            [Date.UTC(2019, 9, 1), 1],
            [Date.UTC(2019, 10, 1), 1],
            [Date.UTC(2019, 11, 1), 1]
        ]
    });

    assert.strictEqual(
        series.graph.attr('d').split(' ').lastIndexOf('L'),
        33,
        'Graph should be continuous when dataGrouping is months (#10000)'
    );
});