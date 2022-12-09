QUnit.test('Data sorting animation', function (assert) {
    var clock = null;

    function getPhysicalXPos(element, width) {
        return Math.round(
            (element.graphic ? element.graphic : element).getBBox(true).x +
                width / 2
        );
    }

    function getCalculatedXPos(point) {
        return Math.round(
            point.series.xAxis.toPixels(point.x) - point.series.xAxis.left
        );
    }

    try {
        clock = TestUtilities.lolexInstall();

        var chart = Highcharts.chart('container', {
                chart: {
                    type: 'column',
                    animation: false
                },
                xAxis: {
                    type: 'category',
                    labels: {
                        animate: true
                    }
                },
                series: [
                    {
                        dataLabels: {
                            enabled: true
                        },
                        dataSorting: {
                            enabled: true
                        },
                        data: [
                            ['A', 5],
                            ['B', 1],
                            ['C', 7]
                        ]
                    }
                ]
            }),
            series = chart.series[0],
            pointC = series.points[2],
            pointB = series.points[1],
            pointA = series.points[0],
            dataLabel = pointA.dataLabel,
            xAxis = series.xAxis,
            label = xAxis.ticks[0].label,
            labelWidth = label.getBBox(true).width,
            initialPos = getCalculatedXPos(pointC),
            initialLabelPos,
            initialDataLabelsPos = dataLabel.x,
            targetLabelPos,
            targetPos,
            done = assert.async();

        series.setData(
            [
                ['A', 1],
                ['B', 5],
                ['C', 2]
            ],
            true,
            { duration: 500 }
        );

        initialLabelPos = getCalculatedXPos(pointB) + xAxis.left;
        targetLabelPos = getCalculatedXPos(pointC) + xAxis.left;

        // Column
        assert.close(
            getPhysicalXPos(pointC, pointC.pointWidth),
            initialPos,
            2,
            'Time 0 - point has not started moving'
        );
        // Label
        assert.close(
            getPhysicalXPos(label, labelWidth),
            initialLabelPos,
            2,
            'Time 0 - label has not started moving'
        );
        // dataLabel
        assert.close(
            dataLabel.translateX,
            initialDataLabelsPos,
            2,
            'Time 0 - label has not started moving'
        );

        setTimeout(function () {
            targetPos = getCalculatedXPos(pointC);
            // Column
            assert.strictEqual(
                getPhysicalXPos(pointC, pointC.pointWidth) > initialPos &&
                    getPhysicalXPos(pointC, pointC.pointWidth) < targetPos,
                true,
                'Time 300 - point has continued'
            );
            // Label
            assert.strictEqual(
                getPhysicalXPos(label, labelWidth) > initialLabelPos &&
                    getPhysicalXPos(label, labelWidth) < targetLabelPos,
                true,
                'Time 300 - label has continued'
            );
            // dataLabel
            assert.notEqual(
                dataLabel.translateX,
                initialDataLabelsPos,
                'Time 300 - datalabel has not started moving'
            );
        }, 300);

        setTimeout(function () {
            // Column
            assert.close(
                getPhysicalXPos(pointC, pointC.pointWidth),
                targetPos,
                2,
                'Time 600 - point has landed'
            );
            // Label
            assert.strictEqual(
                getPhysicalXPos(label, labelWidth),
                targetLabelPos,
                'Time 600 - label has landed'
            );
            // dataLabel
            assert.close(
                Math.round(dataLabel.translateX),
                Math.round(getCalculatedXPos(pointA) - dataLabel.width / 2),
                2,
                'Time 600 - label has landed'
            );

            done();
        }, 600);

        TestUtilities.lolexRunAndUninstall(clock);
    } finally {
        TestUtilities.lolexUninstall(clock);
    }
});

QUnit.test(
    'Data sorting animation - removing and adding points',
    function (assert) {
        var clock = null;

        try {
            clock = TestUtilities.lolexInstall();

            var chart = Highcharts.chart('container', {
                    chart: {
                        type: 'scatter',
                        inverted: true,
                        animation: false
                    },
                    xAxis: {
                        reversed: true,
                        type: 'category',
                        labels: {
                            animate: true
                        }
                    },
                    series: [
                        {
                            dataLabels: {
                                enabled: true,
                                formatter: function () {
                                    return this.point.name;
                                }
                            },
                            marker: {
                                radius: 1
                            },
                            dataSorting: {
                                matchByName: true,
                                enabled: true
                            },
                            data: [
                                ['A', 5],
                                ['B', 1],
                                ['C', 7]
                            ]
                        }
                    ]
                }),
                H = Highcharts,
                series = chart.series[0],
                xAxis = chart.xAxis[0],
                pointC = series.points[2],
                pointD,
                labelC = xAxis.ticks[0].label,
                labelD,
                labelCInitPos =
                    labelC.xy.y - parseFloat(labelC.styles.fontSize),
                labelDInitPos,
                dataLabelC = series.points[2].dataLabel,
                dataLabelD,
                dataLabelCInitPos = dataLabelC.y,
                dataLabelDInitPos,
                done = assert.async();

            series.setData(
                [
                    ['A', 1],
                    ['B', 5],
                    ['D', 2]
                ],
                true,
                { duration: 500 }
            );

            pointD = series.points[2];
            labelD = xAxis.ticks[1].label;
            labelDInitPos = labelD.getBBox(true).y;
            dataLabelD = series.points[2].dataLabel;
            dataLabelDInitPos = dataLabelD.y;
            // Old point
            assert.close(
                series.yAxis.len - pointC.plotY,
                pointC.graphic.getBBox().x,
                2,
                'Time 0 - point has not started moving'
            );
            // Old label
            assert.close(
                labelCInitPos,
                labelC.getBBox(true).y,
                2,
                'Time 0 - label has not started moving'
            );
            // Old datalabel
            assert.strictEqual(
                dataLabelCInitPos < chart.chartHeight,
                true,
                'Time 0 - datalabel has not started moving'
            );
            // New point
            assert.close(
                pointD.graphic.getBBox().x,
                0,
                2,
                'Time 0 - new point should be placed at chart edge'
            );
            // New label
            assert.strictEqual(
                labelDInitPos > chart.chartHeight,
                true,
                'Time 0 - new label has been created below the chart'
            );
            // New datalabel
            assert.close(
                dataLabelDInitPos,
                xAxis.height - dataLabelD.height / 2,
                2,
                'Time 0 - datalabel has been created below the chart'
            );

            setTimeout(function () {
                // Old point
                assert.strictEqual(
                    (series.yAxis.len - pointC.plotY) -
                    pointC.graphic.getBBox().x > 50,
                    true,
                    'Time 200 - point should be in a process of removing animation'
                );
                // Old label
                assert.strictEqual(
                    labelCInitPos + 50 < labelC.getBBox(true).y &&
                        labelC.getBBox(true).y < chart.chartHeight,
                    true,
                    'Time 200 - label should be in a process of removing animation'
                );
                // Old datalabel
                assert.strictEqual(
                    dataLabelC.y > dataLabelCInitPos,
                    true,
                    'Time 200 - datalabel should be in a process of removing animation'
                );
                // New point
                assert.strictEqual(
                    pointD.graphic.getBBox().x > 10 &&
                        pointD.graphic.getBBox().x < pointD.plotX,
                    true,
                    'Time 200 - new point has continued'
                );
                // New label
                assert.strictEqual(
                    labelDInitPos > labelD.getBBox(true).y,
                    true,
                    'Time 200 - new label has continued'
                );
                // New datalabel
                assert.strictEqual(
                    dataLabelD.y < dataLabelDInitPos,
                    true,
                    'Time 200 - new datalabel has continued'
                );
            }, 200);

            setTimeout(function () {
                // Old point
                assert.strictEqual(
                    pointC.x,
                    null,
                    'Time 600 - point has been removed'
                );
                // Old label
                assert.strictEqual(
                    H.defined(labelC.xy),
                    false,
                    'Time 600 - label has been removed'
                );
                // Old datalabel
                assert.strictEqual(
                    H.defined(dataLabelC.element),
                    false,
                    'Time 600 - label has been removed'
                );
                // New point
                assert.close(
                    pointD.graphic.getBBox().x,
                    series.yAxis.len - pointD.plotY,
                    2,
                    'Time 600 - new point should be placed in the final position'
                );
                // New label
                assert.close(
                    labelD.getBBox(true).y,
                    labelD.xy.y - parseFloat(labelD.styles.fontSize),
                    1,
                    'Time 600 - new label should be placed in the final position'
                );
                // New datalabel
                assert.strictEqual(
                    dataLabelD.y < chart.chartHeight,
                    true,
                    'Time 600 - datalabel has been created below the chart'
                );
                done();
            }, 600);

            TestUtilities.lolexRunAndUninstall(clock);
        } finally {
            TestUtilities.lolexUninstall(clock);
        }
    }
);
