QUnit.test('Multiple color axis - general', function (assert) {
    var chart = Highcharts.chart('container', {
            colorAxis: [{
                id: 'first'
            }, {
                id: 'second'
            }],

            series: [{
                type: 'column',
                data: [1, 2, 2]
            }, {
                type: 'line',
                colorAxis: 'second',
                data: [4, 5]
            }]
        }),
        s1 = chart.series[0],
        s2 = chart.series[1];

    assert.strictEqual(
        s1.points[1].color,
        s1.points[2].color,
        'Colors should be the same for the third and second point.'
    );

    assert.notEqual(
        s1.points[0].color,
        s1.points[1].color,
        'Colors should be different for the first two points.'
    );

    assert.notEqual(
        s2.points[0].color,
        s2.points[1].color,
        'Colors should be different for the second series.'
    );

    chart.colorAxis[1].update({
        startOnTick: false,
        min: 4,
        max: 20,
        minColor: 'rgb(255,0,0)'
    });

    assert.strictEqual(
        s2.points[0].color,
        'rgb(255,0,0)',
        'The first point color should be the same as color axis min color.'
    );
});


QUnit.test('Multiple color axis - colorKey', function (assert) {
    var chart = Highcharts.chart('container', {
        colorAxis: [{
            minColor: '#278f36'
        }, {}],

        series: [{
            type: 'bubble',
            colorKey: 'x',
            data: [[1, 1, 1], [1, 3, 100], [2, 2, 2]]
        }, {
            type: 'line',
            colorAxis: 1,
            data: [3, 5]
        }]
    });

    var s1 = chart.series[0],
        s2 = chart.series[0];

    assert.strictEqual(
        s1.points[0].color,
        s1.points[1].color,
        'Colors should be the same for the third and second point.'
    );

    chart.update({
        series: [{
            colorKey: 'y'
        }, {
            colorAxis: 0
        }]
    });

    assert.notEqual(
        s1.points[0].color,
        s1.points[1].color,
        'Colors after color key change should be different.'
    );

    assert.strictEqual(
        s1.points[1].color,
        s2.points[1].color,
        'Points with the same color value should have the same color.'
    );
});


QUnit.test('Multiple color axis - dataClasses', function (assert) {
    var chart = Highcharts.chart('container', {
            chart: {
                polar: true
            },
            yAxis: [{}, {}],
            colorAxis: [{
                minColor: '#1500ff',
                dataClasses: [{
                    to: 2
                }, {
                    from: 2,
                    to: 4
                }, {
                    from: 4,
                    to: 6
                }]
            }, {
                maxColor: '#c9b516',
                dataClasses: [{
                    to: 3
                }, {
                    from: 3,
                    to: 10
                }, {
                    from: 10,
                    to: 30
                }, {
                    from: 30,
                    to: 100
                }]
            }],

            series: [{
                type: 'column',
                yAxis: 1,
                data: [1, 3, 5]
            }, {
                type: 'scatter',
                colorAxis: 1,
                data: [20, 50, 70]
            }]
        }),
        controller = new TestController(chart),
        s1 = chart.series[0],
        legend = chart.legend,
        x = legend.group.translateX + legend.padding + 5,
        y = legend.group.translateY + legend.padding + 5;

    controller.moveTo(x, y);
    controller.click(x, y);

    assert.strictEqual(
        s1.points[0].visible,
        false,
        'Click on data class should hide the right points.'
    );
});

QUnit.test('Multiple color axis - dynamics', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [{
            data: [1, 2, 3]
        }],
        colorAxis: [{}]
    });

    chart.addColorAxis({ dataClasses: [{ to: 100 }] });

    assert.strictEqual(
        chart.colorAxis.length,
        2,
        'The chart should have two color axis.'
    );

    chart.update({ colorAxis: [{ dataClasses: [{ to: 10 }] }] });

    assert.strictEqual(
        chart.colorAxis[0].dataClasses && chart.colorAxis.length === 2,
        true,
        'The first color axis should have data classes.'
    );

    chart.update({ colorAxis: { dataClasses: false } }, true, true);

    assert.strictEqual(
        !chart.colorAxis[0].dataClasses && chart.colorAxis.length === 1,
        true,
        'The chart should have only one color axis without data classes.'
    );
});
