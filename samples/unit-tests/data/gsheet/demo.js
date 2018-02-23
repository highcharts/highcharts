QUnit.skip('data-google-spreadsheetloading', function (assert) {

    var done = assert.async(),
        chart;

    function chartLoad() {

        var options = chart.options;


        assert.strictEqual(
            (Highcharts.isArray(options.xAxis) ? options.xAxis[0] : options.xAxis).type,
            'datetime',
            'X axis is date/time'
        );

        assert.strictEqual(
            options.series.length,
            2,
            'correct number of series'
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
            options.series[1].data[0][1],
            70.4,
            'correct value in series 2 row 1'
        );

        assert.strictEqual(
            options.series[1].data[3][1],
            null,
            'null values respected'
        );

        assert.strictEqual(
            options.series[0].name,
            'Percentage',
            'correct name for series 1'
        );

        assert.strictEqual(
            options.series[1].name,
            'Thing',
            'correct name for series 2'
        );

        done();
    }

    chart = Highcharts.chart('container', {
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

