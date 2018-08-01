/* global TestController */
QUnit.test('Custom point.group option (#5681)', function (assert) {

    assert.expect(0);
    Highcharts.chart('container', {

        chart: {
            type: 'column'
        },

        series: [{
            data: [{
                y: 95,
                group: 'test'
            }, {
                y: 102.9
            }]
        }]

    });
});

QUnit.test('Update className after initially selected (#5777)', function (assert) {

    ['line', 'column', 'pie'].forEach(function (type) {
        var chart = Highcharts.chart('container', {

            chart: {
                type: type,
                animation: false
            },

            series: [{
                data: [{
                    y: 1,
                    selected: true,
                    sliced: true
                }, {
                    y: 2
                }, {
                    y: 3
                }],
                allowPointSelect: true,
                animation: false
            }]

        });

        assert.strictEqual(
            chart.series[0].points[0].graphic.hasClass('highcharts-point-select'),
            true,
            'Class is there initially (' + type + ')'
        );

        // Select the second point, first point should toggle back to unselected
        chart.series[0].points[1].select();
        assert.strictEqual(
            chart.series[0].points[0].graphic.hasClass('highcharts-point-select'),
            false,
            'Selected class is removed (' + type + ')'
        );
    });
});

QUnit.test('Update className with Point.update (#6454)', function (assert) {

    ['line', 'column', 'pie'].forEach(function (type) {
        var chart = Highcharts.chart('container', {

            chart: {
                type: type,
                animation: false
            },

            series: [{
                data: [10, 20, 30],
                animation: false
            }]

        });

        assert.strictEqual(
            chart.series[0].points[0].graphic.hasClass('updated'),
            false,
            'Ready...'
        );

        chart.series[0].points[0].update({
            className: 'updated'
        });
        assert.strictEqual(
            chart.series[0].points[0].graphic.hasClass('updated'),
            true,
            'Point.update successfully applied class name (' + type + ')'
        );
    });
});

QUnit.test(
    'Point with negative color has only one highcharts-negative class',
    function (assert) {
        var chart = Highcharts.chart('container', {
            series: [{
                data: [-10, -7, 5, 16],
                negativeColor: '#123456'
            }]
        });
        assert.strictEqual(
            Highcharts.attr(chart.series[0].points[0].graphic.element,
                'class').match(/highcharts-negative/g).length,
            1,
            'One occurrence of class name'
        );
    }
);

QUnit.test(
    'Point with state options (#6401)',
    function (assert) {

        // Boost module adds hex aliases
        var names = Highcharts.Color.prototype.names;
        Highcharts.Color.prototype.names = {};

        var color = 'red',
            chart = Highcharts.chart('container', {
                chart: {
                    type: 'column'
                },
                plotOptions: {
                    column: {
                        states: {
                            hover: {
                                color: 'blue'
                            }
                        }
                    }
                },
                series: [{
                    data: [{
                        y: 20,
                        states: {
                            hover: {
                                color: color
                            }
                        }
                    }]
                }]
            });

        chart.series[0].points[0].setState('hover');

        assert.strictEqual(
            Highcharts.attr(
                chart.series[0].points[0].graphic.element,
                'fill'
            ),
            color,
            'Correct fill color on hover'
        );

        Highcharts.Color.prototype.names = names;
    }
);

QUnit.test('Select and unselect', function (assert) {

    var chart = Highcharts.chart('container', {
            xAxis: [{
                min: 0,
                max: 10
            }],
            series: [{
                cropThreshold: 5,
                type: 'column',
                allowPointSelect: true,
                data: (function (i) {
                    var tab = [];
                    while (i--) {
                        tab.push(i + 1);
                    }
                    return tab;
                }(200))
            }]
        }),
        series = chart.series[0],
        axis = chart.xAxis[0];

    // select 1st visible point
    series.points[0].select();
    // scroll over points - more than cropThreshold
    axis.setExtremes(190, 200);
    // select last visible point
    series.points[series.points.length - 1].select();
    // scroll back
    axis.setExtremes(0, 10);

    assert.strictEqual(
        series.points[0].selected,
        false,
        'Unselected point out of range (#6445)'
    );
});

QUnit.test('Point className on other elements', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [{
            data: [{
                y: 1
            }, {
                y: 2,
                className: 'my-class'
            }, {
                y: 3
            }],
            type: 'pie'
        }]
    });

    assert.notEqual(
        chart.series[0].points[1].connector.element
            .getAttribute('class').indexOf('my-class'),
        -1,
        'The connector should have the point className'
    );

    chart.series[0].points[1].onMouseOver();
    assert.notEqual(
        chart.series[0].halo.element
            .getAttribute('class').indexOf('my-class'),
        -1,
        'The halo should have the point className'
    );

    chart.series[0].points[0].onMouseOver();
    assert.strictEqual(
        chart.series[0].halo.element
            .getAttribute('class').indexOf('my-class'),
        -1,
        'The halo for other points should not have the point className'
    );
});

QUnit.test('Dynamic point states', function (assert) {
    var chart = new Highcharts.chart('container', {
            chart: {
                zoomType: 'xy'
            },
            tooltip: {
                shared: true
            },
            series: [{
                type: 'line',
                data: [1, 2, 1, 2, 1, 3, 3, 5, 6, 6, 54, 4, 3, 3, 2, 2, 2, 3, 4, 4, 5, 56, 7, 7],
                marker: {
                    enabled: false
                }
            }, {
                type: 'line',
                data: [1, 2, 1, 2, 1, 3, 3, 5, 6, 6, 54, 4, 3, 3, 2, 2, 2, 3, 4, 4, 5, 56, 7, 7].reverse(),
                marker: {
                    enabled: false
                }
            }]
        }),
        leftOffset = Highcharts.offset(chart.container).left,
        topX = chart.xAxis[0].toPixels(8.9, true) + leftOffset,
        topY = chart.yAxis[0].toPixels(0),
        bottomX = chart.xAxis[0].toPixels(9.1, true) + leftOffset,
        bottomY = chart.yAxis[0].toPixels(10),
        haloBox;

    var test = new TestController(chart);

    // Zoom in
    test.pan([topX, topY], [bottomX, bottomY]);

    Highcharts.each(chart.hoverPoints, function (point, index) {
        haloBox = point.series.halo.getBBox(true);

        assert.close(
            haloBox.x + haloBox.width / 2,
            point.plotX,
            1,
            'Point index: ' + index +
                ' - correct x-position for halo after zoom (#8284).'
        );

        assert.close(
            haloBox.y + haloBox.height / 2,
            point.plotY,
            1,
            'Point index: ' + index +
                ' - correct y-position for halo after zoom (#8284).'
        );
    });
});