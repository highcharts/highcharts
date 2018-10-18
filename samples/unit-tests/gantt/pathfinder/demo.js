(function () {
    var squareChartConfig,
        connectionFromPoint = function (point) {
            var connections = point.series.chart.pathfinder.connections;
            return Highcharts.find(connections, function (connection) {
                return connection.fromPoint === point ||
                        connection.endPoint === point;
            });
        };

    QUnit.testStart(function () {
        var axisConfig = {
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
        };
        squareChartConfig = {
            // Create a chart with a perfectly square plot grid
            title: {
                text: null
            },
            yAxis: [Highcharts.merge(axisConfig)],
            xAxis: [Highcharts.merge(axisConfig)],
            chart: {
                width: 400,
                height: 400,
                spacing: [15, 15, 15, 15]
            },
            pathfinder: {
                animation: false
            },

            // Fill the square with a center point, and add points at top,
            // bottom, left, right and all cordners, and connect them to the
            // center
            series: [{
                pathfinder: {
                    marker: {
                        enabled: true
                    }
                },
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
        var error = 0.2,
            startPositions = {
                5: {
                    5: { x: 3, y: 361 },
                    10: { x: 4, y: 182 },
                    15: { x: 3, y: 3 }
                },
                10: {
                    5: { x: 182, y: 360 },
                    15: { x: 182, y: 4 }
                },
                15: {
                    5: { x: 361, y: 361 },
                    10: { x: 360, y: 182 },
                    15: { x: 361, y: 3 }
                }
            },
            endPositions = {
                5: {
                    5: { x: 176, y: 188 },
                    10: { x: 175, y: 182 },
                    15: { x: 176, y: 176 }
                },
                10: {
                    5: { x: 182, y: 189 },
                    15: { x: 182, y: 175 }
                },
                15: {
                    5: { x: 188, y: 188 },
                    10: { x: 189, y: 182 },
                    15: { x: 188, y: 176 }
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
            var connection = connectionFromPoint(point);
            if (point.id !== 'center' && connection) { // All but the center point
                graphic = connection.graphics;
                start = graphic.start.element.getBBox();
                end = graphic.end ? graphic.end.element.getBBox() : {};
                x = point.x;
                y = point.y;

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
            var connection = connectionFromPoint(point);
            if (point.id !== 'center' && connection) { // All but the center point
                graphic = connection.graphics;
                start = graphic.start;
                end = graphic.end;
                x = point.x;
                y = point.y;
                assert.close(
                    start.rotation,
                    startAngles[x][y],
                    error,
                    'Start marker from ' + x + ',' + y + ' rotates correctly'
                );
                assert.close(
                    end.rotation,
                    endAngles[x][y],
                    error,
                    'End marker from ' + x + ',' + y + ' rotates correctly'
                );
            }
        });
    });

    /**
     * Checks that markers align correctly when paths are given a specific
     * alignment.
     */
    QUnit.test('Marker alignment', function (assert) {
        var error = 0.1,
            chart,
            series = squareChartConfig.series[0],
            opts = series.pathfinder,
            aligns = ['left', 'center', 'right'],
            verticalAligns = ['top', 'middle', 'bottom'];

        series.data = [{
            x: 14,
            y: 10,
            connect: 'left'
        }, {
            x: 6,
            y: 10,
            id: 'left'
        }, {
            x: 10,
            y: 6,
            connect: 'top'
        }, {
            x: 10,
            y: 14,
            id: 'top'
        }];

        // This test is run for each combination of align and verticalAlign
        function test(chart, align, verticalAlign) {
            var mod = 4, // The modification on x or y axis
                xMod = 0, // Defaults to 'center'
                yMod = 0, // Defaults to 'middle'
                allPoints = chart.series[0].points,
                connectorPoints = [allPoints[2]];

            Highcharts.each(connectorPoints, function (point) {
                var pointBox = point.graphic.getBBox(),
                    connection = connectionFromPoint(point),
                    graphic = connection.graphics,
                    // Check only the start marker, because both start and end
                    // markers should be placed using the same logic. If end marker
                    // starts acting up, add another pair of asserts for that as
                    // well
                    markerBox = graphic.start.getBBox(),
                    markerCenter = {
                        x: markerBox.x + markerBox.width / 2,
                        y: markerBox.y + markerBox.height / 2
                    },
                    pointCenter = {
                        x: pointBox.x + pointBox.width / 2,
                        y: pointBox.y + pointBox.height / 2
                    };

                if (point.options.connect === 'left') {
                    markerCenter.x += 4;
                } else if (point.options.connect === 'top') {
                    markerCenter.y += 4;
                }
                // Horizontal alignment modifies marker x, so expect an x modification
                if (align === 'left') {
                    xMod = -mod;
                } else if (align === 'right') {
                    xMod = mod;
                } else if (align === 'center') {
                    xMod = markerCenter.x - pointCenter.x;
                }

                // Vertical alignment modifies marker y, so expect a y modification
                if (verticalAlign === 'top') {
                    yMod = -mod + 1;
                } else if (verticalAlign === 'bottom') {
                    yMod = mod + 1;
                } else if (verticalAlign === 'middle') {
                    yMod = markerCenter.y - pointCenter.y;
                }


                // Check x position
                assert.close(
                    markerCenter.x,
                    pointCenter.x + xMod,
                    error,
                    align + ' ' + verticalAlign + ' aligned start marker x correct'
                );

                // Check y position
                assert.close(
                    markerCenter.y,
                    pointCenter.y + yMod,
                    error,
                    align + ' ' + verticalAlign + ' aligned start marker y correct'
                );
            });
        }

        // Combine all verticalAligns...
        Highcharts.each(verticalAligns, function (verticalAlign) {
            // ... with all (horizontal) aligns
            Highcharts.each(aligns, function (align) {
                // Set them on the config...
                opts.marker.verticalAlign = verticalAlign;
                opts.marker.align = align;

                // ... create the chart...
                chart = Highcharts.chart('container', squareChartConfig);

                // ... and test them.
                test(chart, align, verticalAlign);
            });
        });
    });

    /**
     * Checks that options are applied correctly
     */
    QUnit.test('Options applied correctly', function (assert) {
        var pathWithoutMarkers,
            pathWithMarkers,
            chart = Highcharts.chart('container', {
                pathfinder: {
                    animation: false
                },
                series: [{
                    // Default pathfinder settings
                    data: [{
                        y: 1,
                        id: 'one-one',
                        connect: 'one-two'
                    }, {
                        y: 2,
                        id: 'one-two',
                        connect: 'one-one'
                    }]
                }, {
                    pathfinder: {
                        marker: {
                            enabled: true
                        }
                    },
                    data: [{
                        y: 1,
                        id: 'two-one',
                        connect: 'two-two'
                    }, {
                        y: 2,
                        id: 'two-two',
                        connect: 'two-one'
                    }]
                }]
            });

        pathWithoutMarkers = connectionFromPoint(
            chart.series[0].points[0]).graphics;
        pathWithMarkers = connectionFromPoint(
            chart.series[1].points[0]).graphics;

        assert.ok(
            typeof pathWithoutMarkers.start === 'undefined' &&
                typeof pathWithoutMarkers.end === 'undefined',
            'Start and End markers are disabled by default'
        );

        assert.ok(
            typeof pathWithMarkers.start === 'object' &&
                typeof pathWithMarkers.end === 'object',
            'Start and End markers are appplied when enabled'
        );
    });
}());
