QUnit.test('Candlestick series general tests.', function (assert) {
    var color = '#cf0808',
        upColor = '#16a81d',
        negativeColor = '#0e2db5',
        chart = Highcharts.stockChart('container', {
            tooltip: {
                split: false
            },
            series: [{
                type: 'candlestick',
                color: color,
                lineColor: '#555',
                upLineColor: '#16a81d',
                upColor: upColor,
                negativeColor: negativeColor,
                threshold: -20,
                data: [
                    [1602288000000, 5, 15, -15, -5],
                    [1602374400000, 5, 15, -15, 10],
                    [1602460800000, -25, -5, -35, -30],
                    [1602547200000, -15, -5, -35, -10]
                ]
            }]
        }),
        getTooltipStrokes = function (chart, points, split) {
            var strokes = [],
                stroke;

            points.forEach(function (p) {
                p.onMouseOver();
                stroke = split ? chart.tooltip.label.element.lastChild.childNodes[3].getAttribute('stroke') :
                    chart.tooltip.label.stroke;
                strokes.push(stroke);
            });

            return strokes;
        };

    assert.deepEqual(
        getTooltipStrokes(chart, chart.series[0].points, false),
        [color, upColor, negativeColor, upColor],
        'Tooltip should have appropriate stroke color for default, up and negative point (#14826).'
    );

    chart.update({
        tooltip: {
            split: true
        }
    });

    assert.deepEqual(
        getTooltipStrokes(chart, chart.series[0].points, true),
        [color, upColor, negativeColor, upColor],
        'Split tooltip should have appropriate stroke color for default, up and negative point (#14826).'
    );
});
