// Highcharts 4.0.1, Issue #3007
// Halo showing on invisible points in pies
QUnit.test('Halo invisible point (#3007)', function (assert) {

    TestTemplate.test('highcharts/pie', {
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
                controller.mouseOver(
                    (chart.plotLeft + pointBox.x + (pointBox.width / 2)),
                    (chart.plotTop + pointBox.y + (pointBox.height / 2))
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
                controller.mouseMove();
                controller.mouseOut();
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
                controller.mouseOver(
                    (chart.plotLeft + pointBox.x + (pointBox.width / 2)),
                    (chart.plotTop + pointBox.y + (pointBox.height / 2))
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


// Highcharts 4.0.1, Issue #3016
// Halo on sliced pie serie is displayed incorrectly
QUnit.test('Halo sliced point (#3016)', function (assert) {

    TestTemplate.test('highcharts/pie', {
        series: [{
            type: 'pie',
            data: [{
                y: 20,
                name: 'Sliced serie',
                sliced: true
            }, {
                y: 80,
                dataLabels: {
                    enabled: false
                }
            }]
        }]
    }, function (template) {

        var chart = template.chart,
            controller = TestController(chart),
            series = chart.series[0],
            points = series.points;

        assert.deepEqual(
            [
                points[0].graphic.element.getAttribute('visibility'),
                points[1].graphic.element.getAttribute('visibility')
            ], [
                null,
                null
            ],
            'Two points should be visible.'
        );

        assert.strictEqual(
            typeof series.halo,
            'undefined',
            'Halo should not be defined before mouse movements.'
        );

        var clock = TestUtilities.lolexInstall();

        try {

            window.setTimeout(function () {
                var pointBox = points[0].graphic.getBBox();
                controller.mouseOver(
                    (chart.plotLeft + pointBox.x + (pointBox.width / 2)),
                    (chart.plotTop + pointBox.y + (pointBox.height / 2))
                );
            }, 0);

            window.setTimeout(function () {
                var haloBox = series.halo.getBBox();
                assert.deepEqual(
                    [
                        series.halo.point.name,
                        series.halo.element.getAttribute('visibility'),
                        (haloBox.x + haloBox.y)
                    ], [
                        points[0].name,
                        'visible',
                        0
                    ],
                    'Halo should not be visible after mouse over.'
                );
            }, 1);

            window.setTimeout(function () {
                controller.mouseMove();
                controller.mouseOut();
            }, 2);

            window.setTimeout(function () {
                var haloBox = series.halo.getBBox();
                assert.deepEqual(
                    [
                        series.halo.point.name,
                        series.halo.element.getAttribute('visibility'),
                        ((haloBox.x + haloBox.y) === 0)
                    ], [
                        points[0].name,
                        'hidden',
                        true
                    ],
                    'Halo should not be visible after mouse out.'
                );
            }, 3);

            window.setTimeout(function () {
                var pointBox = points[1].graphic.getBBox();
                controller.mouseOver(
                    (chart.plotLeft + pointBox.x + (pointBox.width / 2) - 10),
                    (chart.plotTop + pointBox.y + (pointBox.height / 2) + 10)
                );
            }, 4);

            window.setTimeout(function () {
                var haloBox = series.halo.getBBox();
                assert.deepEqual(
                    [
                        series.halo.point.name,
                        series.halo.element.getAttribute('visibility'),
                        ((haloBox.x + haloBox.y) > 0)
                    ], [
                        points[1].name,
                        'visible',
                        true
                    ],
                    'Halo should be visible after mouse over.'
                );
            }, 5);

            TestUtilities.lolexRunAndUninstall(clock);

        } catch (error) {

            TestUtilities.lolexUninstall(clock);
            throw error;

        }

    });

});

QUnit.test('Update point when hovering slice (#9088)', function (assert) {
    TestTemplate.test('highcharts/pie', {
        tooltip: {
            shared: true
        },
        series: [{
            type: 'pie',
            data: [5, 10, 15]
        }]
    }, function (template) {
        var chart = template.chart,
            controller = TestController(chart),
            pointBox = chart.series[0].points[1].graphic.getBBox();

        controller.mouseOver(
            (chart.plotLeft + pointBox.x + (pointBox.width / 2)),
            (chart.plotTop + pointBox.y + (pointBox.height / 2))
        );

        chart.series[0].points[0].update(10);

        assert.ok(
            true,
            'No errors'
        );
    });
});
