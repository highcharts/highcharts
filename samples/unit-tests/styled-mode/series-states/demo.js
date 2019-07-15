QUnit.test('Inactive state and styledMode', function (assert) {
    var done = assert.async(),
        chart = Highcharts.chart('container', {
            chart: {
                type: 'dependencywheel',
                styledMode: true
            },

            series: [{
                data: [{
                    from: 'A',
                    to: 'B',
                    weight: 1
                }, {
                    from: 'A',
                    to: 'C',
                    weight: 1
                }]
            }]
        }),
        controller = new TestController(chart),
        x = chart.chartWidth / 2,
        y = chart.chartHeight / 2,
        inactivePoints;

    controller.mouseOver(x, y);

    setTimeout(() => {

        inactivePoints = document.querySelectorAll('.highcharts-point-inactive');

        assert.strictEqual(
            inactivePoints.length,
            2,
            'Exactly one point should have inactive state.'
        );

        assert.strictEqual(
            document.querySelectorAll('.highcharts-series-inactive').length,
            0,
            'Series should not have inactive state class, ' +
                'when points within inherit state'
        );
        done();

    }, 500);
});