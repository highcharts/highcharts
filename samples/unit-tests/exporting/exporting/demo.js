QUnit.test(
    'Highcharts.chart array should not alter (#6569)',
    function (assert) {
        var chart = Highcharts.chart('container', {
            series: [{
                data: [5, 10]
            }]
        });

        var initialChartsLength = Highcharts.charts.length;

        chart.getSVG();

        assert.strictEqual(
            Highcharts.charts.length,
            initialChartsLength,
            'Chart length is still as initial'
        );

    }
);