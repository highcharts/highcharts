QUnit.test('performance/highcharts-chart', function (assert) {

    var rounds = 100,
        totalCount = 0,
        totalTime = 0;

    // start benchmark

    totalTime = (new Date()).getTime();

    for (var i = 0, ie = rounds; i < ie; ++i) {

        var chart = Highcharts.chart('container', {

            chart: {
                type: 'column'
            },

            series: [{
                data: [5, 6, 7]
            }]

        });

        assert.ok(
            chart.series[0].data.length,
            3,
            'Chart series length should be 3.'
        );

        if (++totalCount >= rounds) {
            totalTime = ((new Date()).getTime() - totalTime);
            console.log(
                'performance/highcharts-chart: ' +
                totalCount + ' tests, ' +
                totalTime + 'ms'
            );
        }

    }

});
