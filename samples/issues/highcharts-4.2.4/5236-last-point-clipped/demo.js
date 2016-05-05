jQuery(function () {

    QUnit.test('Check last point visible', function (assert) {

        var chart = Highcharts.chart('container', {
            chart: {
                width: 1000
            },

            "series": [{
                "type": "areaspline",
                "data": [
                    [1458428400000, 1452922],
                    [1458514800000, 1568109],
                    [1458601200000, 2486978],
                    [1458687600000, 1683891]
                ],
                "marker": {
                    "enabled": true,
                    "radius": 5
                }
            }],
            yAxis: {
                labels: {
                    enabled: false
                },
                title: {
                    text: null
                }
            },
            "xAxis": {
                type: 'datetime',
                "min": 1458514800000,
                "max": 1458687600000
            }
        });
        assert.strictEqual(
            typeof chart.series[0].points[3].graphic,
            'object',
            'Last point has a marker'
        );

    });
});