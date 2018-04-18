// Highcharts 4.0.1, Issue #3007
// Halo showing on invisible points in pies
QUnit.test('Halo invisible point (#3007)', function (assert) {

    ChartTemplate.test('pie-simple', {
        plotOptions: {
            pie: {
                showInLegend: true
            }
        },
        series: [{
            ignoreHiddenPoint: false,
            type: 'pie',
            data: [
                ['Apples', 5],
                ['Pears', 3],
                {
                    name: 'Carrots',
                    y: 2,
                    visible: false
                },
                ['Bananas', 2]
            ]
        }]
    }, function (template) {

        var chart = template.chart,
            controller = TestController(chart),
            series = chart.series[0],
            points = series.points;

        assert.deepEqual(
            [
                points[0].graphic.element.getAttribute('visibility'),
                points[1].graphic.element.getAttribute('visibility'),
                points[2].graphic.element.getAttribute('visibility'),
                points[3].graphic.element.getAttribute('visibility')
            ], [
                null,
                null,
                'hidden',
                null
            ],
            'Three points should be visible.'
        );

        assert.strictEqual(
            typeof series.halo,
            'undefined',
            'Halo should not be defined before mouse movements.'
        );

        var clock = TestUtilities.lolexInstall();

        try {

            window.setTimeout(function () {
                var pointBox = points[1].graphic.getBBox();
                controller.mouseover(
                    chart.plotLeft + pointBox.x + (pointBox.width / 2),
                    chart.plotTop + pointBox.y + (pointBox.height / 2)
                );
            }, 0);

            window.setTimeout(function () {
                assert.deepEqual(
                    [
                        series.halo.point.name,
                        series.halo.element.getAttribute('visibility')
                    ], [
                        points[1].name,
                        'visible'
                    ],
                    'Halo should be visible after mouse over.'
                );
            }, 1);

            window.setTimeout(function () {
                controller.mousemove();
                controller.mouseout();
            }, 2);

            window.setTimeout(function () {
                assert.deepEqual(
                    [
                        series.halo.point.name,
                        series.halo.element.getAttribute('visibility')
                    ], [
                        points[1].name,
                        'hidden'
                    ],
                    'Halo should not be visible after mouse out.'
                );
            }, 3);

            window.setTimeout(function () {
                var pointBox = points[2].graphic.getBBox();
                controller.mouseover(
                    chart.plotLeft + pointBox.x + (pointBox.width / 2),
                    chart.plotTop + pointBox.y + (pointBox.height / 2)
                );
            }, 4);

            window.setTimeout(function () {
                assert.deepEqual(
                    [
                        series.halo.point.name,
                        series.halo.element.getAttribute('visibility')
                    ], [
                        points[1].name,
                        'hidden'
                    ],
                    'Halo should not be visible after mouse over.'
                );
            }, 5);

            TestUtilities.lolexRunAndUninstall(clock);

        } catch (error) {

            TestUtilities.lolexUninstall(clock);
            throw error;

        }

    });

});
