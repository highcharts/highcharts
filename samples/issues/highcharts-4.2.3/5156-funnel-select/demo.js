jQuery(function () {

    QUnit.test('Funnel selected state', function (assert) {

        var chart = Highcharts.chart('container', {
            chart: {
                type: 'funnel'
            },
            plotOptions: {
                funnel: {
                    allowPointSelect: true,
                    states: {
                        select: {
                            color: 'red'
                        }
                    }
                }
            },
            series: [{
                data: [{
                    y: 1,
                    name: 'selected',
                    selected: true
                }, 2]
            }]
        });

        assert.strictEqual(
            chart.series[0].points[0].graphic.attr('fill'),
            'red',
            'Selected color is red'
        );
    });
});