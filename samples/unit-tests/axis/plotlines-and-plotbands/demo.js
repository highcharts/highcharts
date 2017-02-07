QUnit.test('PlotBands should be rendered also outside the extremes.', function (assert) {
    var chart = Highcharts.chart('container', {
        xAxis: {
            plotBands: [{
                color: 'blue',
                from: 3,
                to: 6
            }, {
                color: 'blue',
                from: 8,
                to: 11
            }]
        },
        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4]
        }]
    });

    assert.strictEqual(
        chart.xAxis[0].plotLinesAndBands[0].svgElem.getBBox(true).width,
        chart.xAxis[0].plotLinesAndBands[1].svgElem.getBBox(true).width,
        'Both plotbands have the same width'
    );

});
