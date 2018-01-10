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