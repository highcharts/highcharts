QUnit.test('Chart spacing options', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            spacingTop: 0
        },
        title: {
            text: null
        },
        yAxis: {
            title: {
                text: null
            }
        },
        series: [{
            data: [1, 2, 3]
        }]
    });

    const yAxis = chart.yAxis[0];
    assert.strictEqual(
        yAxis.top,
        0,
        'The yAxis should start at spacingTop when it is 0 (#24652).'
    );

    const topTick = yAxis.ticks[
            yAxis.tickPositions[yAxis.tickPositions.length - 1]
        ],
        containerTop = chart.container.getBoundingClientRect().top,
        labelTop = topTick.label.element.getBoundingClientRect().top;

    assert.ok(
        labelTop - containerTop >= -1,
        'The top label of the yAxis should not be clipped above the top ' +
        'edge when spacingTop is 0 (#24652).'
    );

});
