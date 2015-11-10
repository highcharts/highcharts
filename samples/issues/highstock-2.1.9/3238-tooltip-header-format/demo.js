$(function () {
    QUnit.test('Formats in tooltip header', function (assert) {
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
            },{
                data: [2, 2, 2]
            },{
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
});