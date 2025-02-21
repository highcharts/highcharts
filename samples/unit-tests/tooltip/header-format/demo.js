QUnit.test('Formats in tooltip header (#3238)', function (assert) {
    var chart = $('#container')
        .highcharts('StockChart', {
            chart: {
                type: 'column'
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataGrouping: {
                        enabled: false
                    }
                }
            },
            xAxis: {
                type: 'datetime'
            },

            series: [
                {
                    data: [{ name: 'Point name', y: 1 }, 1, 1]
                },
                {
                    data: [2, 2, 2]
                },
                {
                    data: [2, 2, 2]
                }
            ],
            tooltip: {
                headerFormat: `
                    point.x = {point.x},
                    point.y = {point.y},
                    point.color = {point.color},
                    point.colorIndex = {point.colorIndex},
                    point.key = {point.key},
                    point.series.name = {point.series.name},
                    point.point.name = {point.point.name},
                    point.percentage = {point.percentage},
                    point.total = {point.total}
                `,
                footerFormat: '{series.name} {point.total}<br>'
            }
        })
        .highcharts();

    chart.tooltip.refresh([chart.series[0].points[0]]);

    assert.strictEqual(
        chart.tooltip.headerFooterFormatter(
            chart.series[0].points[0],
            false
        ),
        `
                    point.x = 0,
                    point.y = 1,
                    point.color = #2caffe,
                    point.colorIndex = 0,
                    point.key = Point name,
                    point.series.name = Series 1,
                    point.point.name = Point name,
                    point.percentage = 20,
                    point.total = 5
                `,
        'Keys in header should be replaced'
    );
    assert.strictEqual(
        chart.tooltip.headerFooterFormatter(
            chart.series[0].points[0],
            true
        ),
        'Series 1 5<br>',
        'Keys in footer are replaced'
    );
});
