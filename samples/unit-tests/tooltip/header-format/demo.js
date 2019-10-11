QUnit.test('Formats in tooltip header (#3238)', function (assert) {
    var chart = $('#container').highcharts('StockChart', {
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

        series: [{
            data: [1, 1, 1]
        }, {
            data: [2, 2, 2]
        }, {
            data: [2, 2, 2]
        }],
        tooltip: {
            headerFormat: '{series.name} {point.total}<br>',
            footerFormat: '{series.name} {point.total}<br>'
        }
    }).highcharts();

    chart.tooltip.refresh([chart.series[0].points[0]]);

    assert.strictEqual(
        chart.tooltip.tooltipFooterHeaderFormatter(chart.series[0].points[0], false),
        'Series 1 5<br>',
        'Keys in header are replaced'
    );
    assert.strictEqual(
        chart.tooltip.tooltipFooterHeaderFormatter(chart.series[0].points[0], true),
        'Series 1 5<br>',
        'Keys in footer are replaced'
    );

});

QUnit.test('Tooltip dateTime formats and timezone', function (assert) {
    var chart = Highcharts.chart('container', {
            time: {
                timezone: 'Europe/Oslo'
            },
            xAxis: {
                type: 'datetime'
            },
            tooltip: {
                dateTimeLabelFormats: {
                    day: '<span class="test">%e %b \'%y</span>'
                }
            },
            series: [{
                data: [
                    [Date.UTC(2016, 9, 22), 10],
                    [Date.UTC(2016, 9, 23), 20]
                ]
            }]
        }),
        controller = new TestController(chart);

    controller.mouseMove(
        chart.series[0].points[0].plotX + chart.plotLeft,
        chart.series[0].points[0].plotY + chart.plotTop
    );

    assert.strictEqual(
        chart.container.querySelectorAll('.test')[0].innerHTML,
        '22 Oct \'16',
        'DateTimeLabelFormat in tooltip should be `%e %b \'%y` (#12182)'
    );
});
