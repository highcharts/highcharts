(function () {
    var defaultChartConfig;

    QUnit.testStart(function () {
        defaultChartConfig = {
            chart: {
                type: 'xrange'
            },
            xAxis: {
                type: 'datetime',
                min: Date.UTC(2014, 11, 1),
                max: Date.UTC(2014, 11, 9)
            },
            yAxis: {
                title: '',
                categories: ['Prototyping', 'Development', 'Testing'],
                reversed: true
            },
            series: [
                {
                    name: 'Project 1',
                    // pointPadding: 0,
                    // groupPadding: 0,
                    borderRadius: 5,
                    pointWidth: 10,
                    data: [
                        {
                            x: Date.UTC(2014, 11, 1),
                            x2: Date.UTC(2014, 11, 2),
                            partialFill: 0.25,
                            y: 0
                        },
                        {
                            x: Date.UTC(2014, 11, 2),
                            x2: Date.UTC(2014, 11, 5),
                            partialFill: 0.5,
                            y: 1
                        },
                        {
                            x: Date.UTC(2014, 11, 8),
                            x2: Date.UTC(2014, 11, 9),
                            partialFill: 0.75,
                            y: 2
                        }
                    ]
                }
            ]
        };
    });

    /**
     * Checks that the extra shape is calculated correctly.
     */
    QUnit.test('translate()', function (assert) {
        var chart,
            i,
            point,
            points,
            shapeArgs,
            partShapeArgs,
            clipRectArgs,
            partialFill;

        chart = Highcharts.chart('container', defaultChartConfig);

        points = chart.series[0].points;
        for (i = 0; i < points.length; i++) {
            point = points[i];
            shapeArgs = point.shapeArgs;
            partShapeArgs = point.partShapeArgs;
            clipRectArgs = point.clipRectArgs;
            partialFill = point.partialFill;

            // partShapeArgs
            assert.equal(
                partShapeArgs.y,
                shapeArgs.y,
                'point ' +
                    i +
                    ' partShapeArgs y-position is correctly calculated'
            );

            assert.equal(
                partShapeArgs.height,
                shapeArgs.height,
                'point ' + i + ' partShapeArgs height is correctly calculated'
            );

            assert.equal(
                partShapeArgs.x,
                shapeArgs.x,
                'point ' + i + ' partShapeArgs has correct calulated x-position'
            );

            assert.equal(
                partShapeArgs.width,
                shapeArgs.width,
                'point ' + i + ' partShapeArgs has correct calculated width'
            );

            // clipRectArgs
            assert.equal(
                clipRectArgs.y,
                shapeArgs.y,
                'point ' +
                    i +
                    ' clipRectArgs y-position is correctly calculated'
            );

            assert.equal(
                clipRectArgs.height,
                shapeArgs.height,
                'point ' + i + ' clipRectArgs height is correctly calculated'
            );

            assert.equal(
                clipRectArgs.x,
                shapeArgs.x,
                'point ' + i + ' clipRectArgs has correct calulated x-position'
            );

            assert.close(
                clipRectArgs.width,
                shapeArgs.width * partialFill,
                1,
                'point ' + i + ' clipRectArgs has correct calculated width'
            );
        }
    });

    /**
     * Checks that the extra shape is rendered correctly. Skip MS because it
     * finds clip paths differently.
     */
    QUnit[Highcharts.isMS ? 'skip' : 'test']('drawPoints()', function (assert) {
        var chart,
            i,
            points,
            point,
            $graphic,
            $graphOrig,
            $graphOver,
            clipRectID,
            $clipRect,
            graphOverBox,
            origX,
            overX,
            origY,
            overY,
            origWidth,
            overWidth,
            clipWidth,
            origHeight,
            overHeight,
            clipHeight,
            partialFill,
            error = 1;

        // THE CHART
        chart = Highcharts.chart('container', defaultChartConfig);

        points = chart.series[0].points;
        for (i = 0; i < points.length; i++) {
            point = points[i];
            const { rect, partRect } = point.graphic;
            origX = rect.x;
            overX = partRect.x;
            origY = rect.y;
            overY = partRect.y;
            origWidth = rect.width;
            overWidth = partRect.width;
            origHeight = rect.height;
            overHeight = partRect.height;

            // partShapeArgs
            assert.close(
                overY,
                origY,
                error,
                'point ' + i + ' partShapeArgs y-position is rendered correctly'
            );

            assert.close(
                overHeight,
                origHeight,
                error,
                'point ' + i + ' partShapeArgs height is rendered correctly'
            );

            assert.close(
                overX,
                origX,
                error,
                'point ' + i + ' partShapeArgs has correct rendered x-position'
            );

            assert.close(
                overWidth,
                origWidth,
                error,
                'point ' + i + ' partShapeArgs has correct rendered width'
            );
        }
    });

    /**
     * Checks that the fill option in a point's partialFill options is applied
     */
    QUnit.test(
        'point fill option is applied in drawPoints()',
        function (assert) {
            var chart,
                $graphic,
                expected = '#fa0',
                actual;

            defaultChartConfig.series[0].data[0].partialFill = {
                amount: 0.25,
                fill: expected
            };
            chart = Highcharts.chart('container', defaultChartConfig);
            $graphic = $(chart.series[0].data[0].graphic.element);
            actual = $graphic.find('.highcharts-partfill-overlay').attr('fill');
            assert.equal(
                actual,
                expected,
                'fill in point.partialFill options is applied'
            );
        }
    );

    /**
     * Checks that the fill option in a series' partialFill options is applied
     */
    QUnit.test('General', function (assert) {
        var chart,
            $graphic,
            expected = '#000',
            actual;

        defaultChartConfig.series[0].partialFill = {
            amount: 0.25,
            fill: expected
        };
        chart = Highcharts.chart('container', defaultChartConfig);
        $graphic = $(chart.series[0].data[0].graphic.element);
        actual = $graphic.find('.highcharts-partfill-overlay').attr('fill');
        assert.equal(
            actual,
            expected,
            'Fill in point.partialFill options should be applied'
        );

        chart.series[0].points[0].onMouseOver();
        assert.notEqual(
            chart.tooltip.label.element.textContent.indexOf('Monday'),
            -1,
            'The tooltip header should container formatted date (#9301)'
        );
    });
}());
