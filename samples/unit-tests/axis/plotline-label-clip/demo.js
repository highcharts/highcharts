QUnit.test('Plot line label outside plot area (#22758)', function (assert) {
    var chart = Highcharts.chart('container', {
        yAxis: {
            plotLines: [{
                value: 100,
                label: {
                    clip: true,
                    // eslint-disable-next-line max-len
                    text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. '
                }
            }]
        },
        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4]
        }]
    });

    var plotLine = chart.yAxis[0].plotLinesAndBands[0],
        label = plotLine.label,
        labelRight = label.alignAttr.x + label.getBBox().width,
        plotRight = chart.plotLeft + chart.plotWidth;

    assert.ok(
        labelRight <= plotRight,
        'Plot line label should not extend beyond plot area right edge. ' +
        'Label right: ' + labelRight + ', Plot area right: ' + plotRight
    );
});
