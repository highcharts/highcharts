QUnit.test('Check that column width takes hidden series into account(#4921)', function (assert) {
    var chart = Highcharts.chart('container', {
            chart: {
                type: 'column',
                ignoreHiddenSeries: false
            },
            series: [{
                name: 'Tokyo',
                data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
            }, {
                name: 'Tokyo2',
                data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
            }]
        }),
        colWidth = chart.series[0].points[0].pointWidth;

    chart.series[0].hide();
    chart.series[1].hide();
    chart.series[0].show();

    assert.strictEqual(
        chart.series[0].points[0].pointWidth,
        colWidth,
        'Columns remain same width as with 2 series visible'
    );
});

QUnit.test('Column width calculated correctly when using a linked xAxis (#5923).', function (assert) {
    var chart = $('#container').highcharts('StockChart', {
        chart: {
            width: 700
        },
        plotOptions: {
            series: {
                pointStart: Date.UTC(2016, 1, 1),
                pointInterval: 36e5 * 24
            }
        },

        xAxis: [{}, {
            linkedTo: 0,
            visible: false
        }],

        series: [{
            data: (function () {
                var data = [],
                    i = 0;
                for (; i < 100; i++) {
                    data.push(i % 5);
                }
                return data;
            }()),
            tooltip: {
                valueDecimals: 2
            }
        }, {
            type: 'column',
            xAxis: 1,
            data: (function () {
                var data = [],
                    i = 0;
                for (; i < 100; i++) {
                    data.push(i % 5);
                }
                return data;
            }())
        }]
    }).highcharts();

    assert.strictEqual(
        chart.series[1].columnMetrics.width < 5,
        true,
        'column width is correctly calculated'
    );
});