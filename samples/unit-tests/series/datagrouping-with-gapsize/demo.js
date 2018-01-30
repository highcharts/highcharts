
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
        'Graph visible when dataGrouping is enabled'
    );
});