$(function () {
    QUnit.test('PlotBands should be rendered according to the axis.offset', function (assert) {
        var chart = new Highcharts.Chart({
            chart: {
                type: 'gauge',
                renderTo: 'container'
            },
            pane: {
                startAngle: -150,
                endAngle: 150
            },
            yAxis: [{
                min: 0,
                max: 200,
                plotBands: [{
                    from: 0,
                    to: 120,
                    color: 'blue'
                }]
            }, {
                offset: 30,
                min: 0,
                max: 200,
                plotBands: [{
                    from: 0,
                    to: 120,
                    color: 'red'
                }]
            }],
            series: [{
                data: [80]
            }, {
                yAxis: 1,
                data: [100]
            }]
        });


        assert.strictEqual(
            chart.yAxis[0].plotLinesAndBands[0].svgElem.d === chart.yAxis[1].plotLinesAndBands[0].svgElem.d,
            false,
            'Proper position plotBands'
        );
    });
});