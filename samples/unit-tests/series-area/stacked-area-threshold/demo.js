(function () {
    function checkY(chart, assert) {
        assert.strictEqual(
            typeof chart.series[0].points[2].graphic.attr('y'),
            'number',
            'Valid placement'
        );
        assert.strictEqual(
            chart.series[0].points[2].graphic.attr('y'),
            chart.series[1].points[2].graphic.attr('y'),
            'Same place'
        );
    }

    QUnit.test('Positive (#5280)', function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                type: 'area'
            },
            plotOptions: {
                area: {
                    stacking: 'normal',
                    threshold: -10
                }
            },
            series: [{
                data: [1, 1, 0, 1, 1]
            }, {
                data: [1, 1, 0, 1, 1]
            }]
        });

        checkY(chart, assert);
    });

    QUnit.test('Negative', function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                type: 'area'
            },
            plotOptions: {
                area: {
                    stacking: 'normal',
                    threshold: 10
                }
            },
            series: [{
                data: [-1, -1, 0, -1, -1]
            }, {
                data: [-1, -1, 0, -1, -1]
            }]
        });

        checkY(chart, assert);
    });

    QUnit.test('Reversed', function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                type: 'area'
            },
            plotOptions: {
                area: {
                    stacking: 'normal',
                    threshold: -10
                }
            },
            yAxis: {
                reversed: true
            },
            series: [{
                data: [1, 1, 0, 1, 1]
            }, {
                data: [1, 1, 0, 1, 1]
            }]
        });

        checkY(chart, assert);
    });

    QUnit.test('Un-reversed stacks', function (assert) {
        const chart = Highcharts.chart('container', {
                chart: {
                    type: 'area'
                },
                plotOptions: {
                    area: {
                        stacking: 'normal',
                        threshold: -10
                    }
                },
                yAxis: {
                    reversedStacks: false
                },
                series: [{
                    data: [1, 1, 0, 1, 1]
                }, {
                    data: [1, 1, 0, 1, 1]
                }]
            }),
            controller = new TestController(chart);

        checkY(chart, assert);

        let coveredSeriesClicked = false;

        chart.update({
            series: [{
                data: [5, 8, 12, 10, 9],
                point: {
                    events: {
                        click() {
                            coveredSeriesClicked = true;
                        }
                    }
                }
            }, {
                data: [13, 15, 18, 20, 10]
            }]
        });

        const pointBox = chart.series[0].points[1].graphic.getBBox();

        controller.moveTo(
            pointBox.x + chart.plotLeft + (pointBox.width / 2),
            pointBox.y + chart.plotTop + (pointBox.height / 2)
        );

        controller.click(
            pointBox.x + chart.plotLeft + (pointBox.width / 2),
            pointBox.y + chart.plotTop + (pointBox.height / 2)
        );

        assert.ok(
            coveredSeriesClicked,
            `Covered series should be clickable and click events should work 
            (#18744).`
        );
    });
}());
