QUnit.test(
    'The connector line in waterfall in case of a null value (#8024)',
    function (assert) {
        var chart = Highcharts.chart('container', {
            series: [
                {
                    type: 'waterfall',
                    data: [120000, null, 231000, -342000, -233000]
                }
            ]
        });

        assert.notOk(
            isNaN(chart.series[0].graph.pathArray[2][2]),
            'The connector line skips a point with a null Y (#18636)'
        );
    }
);
