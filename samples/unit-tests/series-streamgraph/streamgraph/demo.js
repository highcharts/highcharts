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

    chart.series[0].hide();
    chart.series[1].hide();
    assert.deepEqual(
        [chart.yAxis[0].min, chart.yAxis[0].max],
        [-7.5, 7.5],
        'Extremes with a single series, previous series hidden (#7896)'
    );


    chart.series[2].remove();
    chart.series[1].remove();
    chart.series[0].show();
    assert.deepEqual(
        [chart.yAxis[0].min, chart.yAxis[0].max],
        [-6.5, 6.5],
        'Extremes with a single series (#7896)'
    );

});

