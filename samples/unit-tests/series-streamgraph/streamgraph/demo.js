QUnit.test('Streamgraph extremes', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'streamgraph'
        },
        yAxis: {
            startOnTick: false,
            endOnTick: false,
            minPadding: 0,
            maxPadding: 0
        },
        series: [{
            data: [9, 9, 9, 9, 8, 13]
        }, {
            data: [4, 24, 24, 24, 22, 8]
        }, {
            data: [15, 15, 15, 5, 13, 5]
        }]
    });
    assert.deepEqual(
        [chart.yAxis[0].min, chart.yAxis[0].max],
        [-24, 24],
        'Extremes with default reversedStacks'
    );

    chart.yAxis[0].update({
        reversedStacks: false
    });
    assert.deepEqual(
        [chart.yAxis[0].min, chart.yAxis[0].max],
        [-24, 24],
        'Extremes with reversedStacks: false (#7281)'
    );
});

