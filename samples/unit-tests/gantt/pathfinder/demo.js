var squareChartConfig;

QUnit.testStart(function () {
    squareChartConfig = {
        // Create a chart with a perfectly square plot grid
        title: {
            text: null
        },
        yAxis: [{
            min: 5,
            max: 15,
            startOnTick: true,
            endOnTick: true,
            minPadding: 0,
            maxPadding: 0,
            tickLength: 0,
            tickInterval: 5,
            title: {
                text: null
            },
            labels: {
                enabled: false
            }
        }],
        xAxis: [{
            min: 5,
            max: 15,
            startOnTick: true,
            endOnTick: true,
            minPadding: 0,
            maxPadding: 0,
            tickLength: 0,
            tickInterval: 5,
            title: {
                text: null
            },
            labels: {
                enabled: false
            }
        }],
        chart: {
            width: 400,
            height: 400,
            spacing: [15, 15, 15, 15]
        },

        // Fill the square with a center point, and add points at top,
        // bottom, left, right and all cordners, and connect them to the
        // center
        series: [{
            showInLegend: false,
            data: [{
                x: 10,
                y: 10,
                id: 'center'
            }, {
                x: 10,
                y: 5,
                connect: 'center'
            }, {
                x: 15,
                y: 5,
                connect: 'center'
            }, {
                x: 15,
                y: 10,
                connect: 'center'
            }, {
                x: 15,
                y: 15,
                connect: 'center'
            }, {
                x: 10,
                y: 15,
                connect: 'center'
            }, {
                x: 5,
                y: 15,
                connect: 'center'
            }, {
                x: 5,
                y: 10,
                connect: 'center'
            }, {
                x: 5,
                y: 5,
                connect: 'center'
            }],
            type: 'scatter'
        }]
    };
});

QUnit.test('Marker placement', function (assert) {
    var error = 0.01,
        startPositions = {
            5: {
                5: { x: 2.82, y: 359.17 },
                10: { x: 4, y: 181 },
                15: { x: 2.82, y: 2.82 }
            },
            10: {
                5: { x: 181, y: 358 },
                15: { x: 181, y: 4 }
            },
            15: {
                5: { x: 359.17, y: 359.17 },
                10: { x: 358, y: 181 },
                15: { x: 359.17, y: 2.82 }
            }
        },
        endPositions = {
            5: {
                5: { x: 174.17, y: 187.82 },
                10: { x: 173, y: 181 },
                15: { x: 174.17, y: 174.17 }
            },
            10: {
                5: { x: 181, y: 189 },
                15: { x: 181, y: 173 }
            },
            15: {
                5: { x: 187.82, y: 187.82 },
                10: { x: 189, y: 181 },
                15: { x: 187.82, y: 174.17 }
            }
        },
        chart = Highcharts.chart('container', squareChartConfig),
        points = chart.series[0].points,
        graphic,
        start,
        end,
        x,
        y;

    Highcharts.each(points, function (point) {
        if (point.id !== 'center') { // All but the center point
            graphic = point.connectingPathGraphics;
            start = graphic.start.element.getBBox();
            end = graphic.end.element.getBBox();
            x = point.x;
            y = point.y;

            console.log(x, y, start, end);

            // Start marker
            assert.close(
                start.x,
                startPositions[point.x][point.y].x,
                error,
                'Start marker x from ' + x + ',' + y + ' positioned correctly'
            );

            assert.close(
                start.y,
                startPositions[point.x][point.y].y,
                error,
                'Start marker y from ' + x + ',' + y + ' positioned correctly'
            );

            // End marker
            assert.close(
                end.x,
                endPositions[point.x][point.y].x,
                error,
                'End marker x from ' + x + ',' + y + ' positioned correctly'
            );

            assert.close(
                end.y,
                endPositions[point.x][point.y].y,
                error,
                'End marker y from ' + x + ',' + y + ' positioned correctly'
            );
        }
    });
});

// Checks that the rotation of the markers is correctly calculated.
QUnit.test('Marker rotation', function (assert) {
    var error = 0.001,
        startAngles = {
            5: {
                5: -45,
                10: 0,
                15: 45
            },
            10: {
                5: -90,
                15: 90
            },
            15: {
                5: -135,
                10: -180,
                15: 135
            }
        },
        endAngles = {
            5: {
                5: 135,
                10: -180,
                15: -135
            },
            10: {
                5: 90,
                15: -90
            },
            15: {
                5: 45,
                10: 0,
                15: -45
            }
        },
        chart = Highcharts.chart('container', squareChartConfig),
        points = chart.series[0].points,
        graphic,
        start,
        end,
        x,
        y;

    Highcharts.each(points, function (point) {
        if (point.id !== 'center') { // All but the center point
            graphic = point.connectingPathGraphics;
            start = graphic.start;
            end = graphic.end;
            x = point.x;
            y = point.y;
            assert.close(
                start.element.transform.baseVal[0].angle,
                startAngles[x][y],
                error,
                'Start marker from ' + x + ',' + y + ' rotates correctly'
            );
            assert.close(
                end.element.transform.baseVal[0].angle,
                endAngles[x][y],
                error,
                'End marker from ' + x + ',' + y + ' rotates correctly'
            );
        }
    });
});
