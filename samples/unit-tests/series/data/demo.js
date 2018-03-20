
QUnit.test('NaN in graphs', function (assert) {

    var chart = Highcharts.chart('container', {

        series: [{
            data: [NaN, 71.5, 106.4, 129.2, 144.0, NaN, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]

    });

    assert.ok(
        chart.series[0].graph.attr('d').length > 100,
        'Path is ok'
    );

    assert.notEqual(
        chart.series[0].graph.attr('d'),
        'M 0 0',
        'Path is ok'
    );

});

QUnit.test('Zeroes on log axis', function (assert) {

    var chart = Highcharts.chart('container', {

        yAxis: {
            type: 'logarithmic'
        },

        series: [{
            data: [1, 2, 0, 8, 16, 32, 64, 128, 256, 512],
            pointStart: 1
        }]
    });

    assert.strictEqual(
        chart.series[0].graph.attr('d').split(' ')[6],
        'M',
        'Gap detected'
    );

});

QUnit.test('X is null (#7515)', function (assert) {

    var chart = Highcharts.chart('container', {

        series: [{
            data: [{
                x: 100,
                y: 100
            }]
        }, {
            data: [{
                x: null,
                y: 95
            }]
        }]

    });

    assert.strictEqual(
        chart.xAxis[0].ticks[100].label.element.textContent,
        '100',
        'X axis should be rendered for the first series'
    );

    assert.strictEqual(
        chart.yAxis[0].ticks[100].label.element.textContent,
        '100',
        'X axis should be rendered for the first series'
    );

});

// Highcharts 4.1.1, Issue #3793
// Dealing with large numbers on yAxis
QUnit.test('Huge numbers (#3793)', function (assert) {

    var chart = Highcharts.chart('container', {
        title: {
            text: 'Huge numbers failed with JS error'
        },
        series: [{
            data: [
                1.7976931348623157e+300,
                1.7976931348623157e+301,
                1.7976931348623157e+306]
        }]
    });

    assert.ok(
        chart.series[0] &&
        chart.series[0].data[2] &&
        chart.series[0].data[2].graphic instanceof Highcharts.SVGElement,
        'Points should be rendered'
    );

});