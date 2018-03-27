// Highcharts 4.1.1, Issue #3875
// Chrome crashes with close data
QUnit.test(
    'Chrome crash (#3875)',
    function (assert) {

        var catchedException;

        try {

            var chart = Highcharts.chart('container', {
                chart: {
                    width: 400,
                    height: 250,
                    marginTop: 100,
                    marginBottom: 100
                },
                series: [{
                    data: [0.0004, 0.00039999999999999996, 0.0004]
                }],

                yAxis: [{
                    minorTickInterval: "auto"
                }]
            });

            assert.ok(
                chart.series[0].data[2].graphic &&
                chart.series[0].data[2].graphic.element,
                'There should be points rendered.'
            );

        } catch (ex) {

            catchedException = ex;

        } finally {

            assert.strictEqual(
                catchedException,
                undefined,
                'There should be no exception.'
            );

        }
    }
);