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
        }).highcharts(),
        labelConfig = chart.series[0].points[0].getLabelConfig();

        chart.tooltip.refresh([chart.series[0].points[0]]);

        assert.strictEqual(
            chart.tooltip.tooltipFooterHeaderFormatter(labelConfig, false),
            'Series 1 5<br>',
            'Keys in header are replaced'
        );
        assert.strictEqual(
            chart.tooltip.tooltipFooterHeaderFormatter(labelConfig, true),
            'Series 1 5<br>',
            'Keys in footer are replaced'
        );

    });
});