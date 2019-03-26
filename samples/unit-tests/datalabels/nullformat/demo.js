QUnit.test(
    '#9233: data labels should be displayed for visible null points.',
    function (assert) {
        var chart = Highcharts.chart('container', {
            series: [{
                type: 'heatmap',
                data: [
                    [0, 0, null]
                ],
                dataLabels: {
                    enabled: true,
                    nullFormat: 'N/A'
                }
            }]
        });

        assert.ok(
            chart.series[0].points[0].dataLabel,
            'Data label created for null point.'
        );
    }
);
