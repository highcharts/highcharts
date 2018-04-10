QUnit.test('performance/chart-template', function (assert) {

    var rounds = 100,
        totalCount = 0,
        totalTime = 0;

    function test(template) {

        assert.strictEqual(
            template.chart.series[0].data.length,
            3,
            'Chart series length should be 3.'
        );

        if (++totalCount >= rounds) {
            totalTime = ((new Date()).getTime() - totalTime);
            console.log(
                'performance/chart-template: ' +
                totalCount + ' tests, ' +
                totalTime + 'ms'
            );
        }

    }

    // start benchmark

    totalTime = (new Date()).getTime();

    for (var i = 0, ie = rounds; i < ie; ++i) {
        ChartTemplate.test('line-simple', {

            chart: {
                type: 'column'
            },

            series: [{
                data: [5, 6, 7]
            }]

        }, test);
    }

});
