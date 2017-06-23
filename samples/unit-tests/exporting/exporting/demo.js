QUnit.test(
    'Highcharts.chart array should not alter (#6569)',
    function (assert) {
        var chart = Highcharts.chart('container', {
            series: [{
                data: [5, 10]
            }]
        });

        assert.strictEqual(
            Highcharts.charts.length,
            1,
            'Chart length is 1'
        );

        assert.strictEqual(
            Highcharts.chartCount,
            1,
            'Chart count is 1'
        );

        chart.getSVG();

        assert.strictEqual(
            Highcharts.charts.length,
            1,
            'Chart length is still 1'
        );
        assert.strictEqual(
            Highcharts.chartCount,
            1,
            'Chart count is still 1'
        );

    }
);