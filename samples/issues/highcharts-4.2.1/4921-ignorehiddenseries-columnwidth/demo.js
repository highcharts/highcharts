$(function () {
    QUnit.test('Check that column width takes hidden series into account', function (assert) {
        var chart = Highcharts.chart('container', {
                chart: {
                    type: 'column',
                    ignoreHiddenSeries: false
                },
                series: [{
                    name: 'Tokyo',
                    data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
                }, {
                    name: 'Tokyo2',
                    data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
                }]
            }),
            colWidth = chart.series[0].points[0].pointWidth;

        chart.series[0].hide();
        chart.series[1].hide();
        chart.series[0].show();

        assert.strictEqual(
            chart.series[0].points[0].pointWidth,
            colWidth,
            'Columns remain same width as with 2 series visible'
        );
    });
});
