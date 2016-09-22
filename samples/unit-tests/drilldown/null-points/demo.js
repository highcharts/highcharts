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
