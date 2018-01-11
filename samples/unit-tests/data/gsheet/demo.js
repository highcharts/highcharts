QUnit.test('data-google-spreadsheetloading', function (assert) {

    var chart = Highcharts.chart('container', {
            data: {
                googleSpreadsheetKey: '1BNuncjK16FzPUE045dfBUheODVYIJpe1UXtVFLprmgw'
            }
        }),
        done = assert.async(),
        unlisten = Highcharts.addEvent(Highcharts.Chart.prototype, 'load', function () {

            var options = chart.options;


            assert.strictEqual(
                (Highcharts.isArray(options.xAxis) ? options.xAxis[0] : options.xAxis).type,
                'datetime',
                'X axis is date/time'
            );

            assert.strictEqual(
                options.series[0].data.length,
              9,
              'correct amount of rows'
            );

            assert.strictEqual(
                options.series[0].data[0][1],
                12,
                'correct value in series 1 row 1'
            );

            assert.strictEqual(
                options.series[1].data[3][1],
                null,
                'null values respected'
            );

            unlisten();
            done();
        });
});

