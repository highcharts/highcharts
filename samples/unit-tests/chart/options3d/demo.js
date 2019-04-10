/* eslint func-style:0 */


QUnit.test('3D pie animation', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            options3d: {
                enabled: true,
                alpha: 45,
                beta: 0
            },
            type: 'pie',
            animation: {
                duration: 1
            }
        },
        series: [{
            data: [1, 2, 3],
            depth: 35,
            animation: false
        }]
    });

    var clock = TestUtilities.lolexInstall();
    try {

        var d = chart.series[0].points[0].graphic.element.querySelector('path').getAttribute('d');

        assert.strictEqual(
            d.indexOf('M'),
            0,
            'Path makes sense'
        );

        chart.series[0].points[1].setVisible(false);

        TestUtilities.lolexRunAndUninstall(clock);

        assert.notEqual(
            chart.series[0].points[0].graphic.element.querySelector('path').getAttribute('d'),
            d,
            'Path has changed since update'
        );

    } finally {
        TestUtilities.lolexUninstall(clock);
    }
});
