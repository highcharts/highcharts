['pie', 'column'].forEach(function (type) {
    QUnit.test('Nulls in ' + type + ' (#5649)', function (assert) {

        assert.expect(0);

        var chart = Highcharts.chart('container', {
            chart: {
                type: type,
                animation: false
            },
            series: [{
                data: [{
                    y: 100,
                    drilldown: 'Chrome'
                }],
                animation: false
            }],
            drilldown: {
                series: [{
                    id: 'Chrome',
                    data: [
                        ['v40.0', 5],
                        ['v41.0', null],
                        ['v42.0', 3.68]
                    ]
                }]
            }
        });

        chart.series[0].points[0].doDrilldown();
    });
});

QUnit.test('Nulls in categorized column (#5750)', function (assert) {

    assert.expect(0);
    Highcharts.chart('container', {

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
            data: [29.9, null, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
            type: 'column'
        }]

    });
});
