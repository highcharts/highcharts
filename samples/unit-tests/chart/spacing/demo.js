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

    const yAxisTop = chart.yAxis[0].top;

    assert.strictEqual(
        yAxisTop,
        7,
        'The top label of the yAxis should be ' +
        'respected by spacingTop when set to 0 (#24652).'
    );

});
