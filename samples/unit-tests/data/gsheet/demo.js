QUnit.test('data-google-spreadsheetloading', function (assert) {

    var done = assert.async();

    function chartLoad() {

        var chart = this,
            tested = false;

        Highcharts.addEvent(chart, 'afterUpdate', function () {
            if (!tested) {
                var options = chart.userOptions;

                tested = true;

                assert.strictEqual(
                    (
                        Highcharts.isArray(options.xAxis) ?
                            options.xAxis[0] :
                            options.xAxis
                    ).type,
                    'datetime',
                    'X axis is date/time'
                );

                assert.strictEqual(
                    chart.series.length,
                    2,
                    'correct number of series'
                );

                assert.strictEqual(
                    chart.series[0].xData.length,
                    9,
                    'correct amount of rows'
                );

                assert.strictEqual(
                    chart.series[0].yData[0],
                    12,
                    'correct value in series 1 row 1'
                );

                assert.strictEqual(
                    chart.series[1].yData[0],
                    70.4,
                    'correct value in series 2 row 1'
                );

                assert.strictEqual(
                    chart.series[1].yData[3],
                    null,
                    'null values respected'
                );

                assert.strictEqual(
                    chart.series[0].name,
                    'Percentage',
                    'correct name for series 1'
                );

                assert.strictEqual(
                    chart.series[1].name,
                    'Thing',
                    'correct name for series 2'
                );

                done();
            }
        });
    }

    Highcharts.chart('container', {
        chart: {
            events: {
                load: chartLoad
            }
        },
        data: {
            googleSpreadsheetKey: '1BNuncjK16FzPUE045dfBUheODVYIJpe1UXtVFLprmgw'
        }
    });

});
