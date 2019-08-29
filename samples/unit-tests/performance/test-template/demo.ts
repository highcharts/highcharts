// Skipped, this test pollutes the output and is probably not needed for
// day-to-day testing. Overall Highcharts performance can be monitored through
// the total test time.
QUnit.skip(
    'performance/test-template',
    (assert: Assert) => {

        const ROUNDS = 100;

        let totalCount = 0,
            totalTime = 0;

        // start benchmark

        totalTime = (new Date()).getTime();

        for (var i = 0, ie = ROUNDS; i < ie; ++i) {
            TestTemplate.test(
                'highcharts/line',
                {
                    series: [{
                        type: "column",
                        data: [5, 6, 7]
                    }]

                },
                (template: TestTemplate) => {

                    assert.strictEqual(
                        template.chart.series[0].data.length,
                        3,
                        'Chart series length should be 3.'
                    );

                    if (++totalCount >= ROUNDS) {
                        totalTime = ((new Date()).getTime() - totalTime);
                        console.log(
                            'performance/test-template: ' +
                            totalCount + ' tests, ' +
                            totalTime + 'ms'
                        );
                    }
                }
            );
        }
    }
);
