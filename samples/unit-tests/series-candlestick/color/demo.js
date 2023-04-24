QUnit.test('Candlestick series colors tests.', function (assert) {
    var data = [
            [3, 4.5, 6, 3, 5.5],
            [4, 8.5, 9, 3.5, 4],
            {
                x: 5,
                open: 1,
                high: 3,
                low: 0.5,
                close: 2,
                lineColor: '#FF0000'
            },
            {
                x: 6,
                open: 2,
                high: 2,
                low: 0.5,
                close: 1.5,
                lineColor: '#FF0000'
            }
        ],
        color = '#cf0808',
        upColor = '#16a81d',
        negativeColor = '#0e2db5',
        getTooltipStrokes = function (chart, points, split) {
            var strokes = [],
                stroke;

            points.forEach(function (p) {
                p.onMouseOver();
                stroke = split ? chart.tooltip.label.element.lastChild.childNodes[0].getAttribute('stroke') :
                    chart.tooltip.label.attr('stroke');
                strokes.push(stroke);
            });

            return strokes;
        },
        chart,
        points;

    $('#container').highcharts('StockChart', {
        tooltip: {
            split: false
        },
        rangeSelector: {
            selected: 1
        },
        series: [
            {
                lineColor: 'black',
                type: 'candlestick',
                name: 'test',
                data: data,
                color: color,
                upColor: upColor,
                negativeColor: negativeColor,
                threshold: 3
            }
        ]
    });

    chart = $('#container').highcharts();
    points = chart.series[0].points;

    // (#4226).
    assert.equal(
        points[0].graphic.element.getAttribute('stroke'),
        'black',
        'Regular up (#4226).'
    );
    assert.equal(
        points[1].graphic.element.getAttribute('stroke'),
        'black',
        'Regular down (#4226).'
    );

    assert.equal(
        points[2].graphic.element.getAttribute('stroke').toLowerCase(),
        '#ff0000',
        'Individual up (#4226).'
    );
    assert.equal(
        points[3].graphic.element.getAttribute('stroke').toLowerCase(),
        '#ff0000',
        'Individual down (#4226).'
    );

    // (#14826).
    assert.deepEqual(
        getTooltipStrokes(chart, chart.series[0].points, false),
        [upColor, color, upColor, negativeColor],
        'Tooltip should have appropriate stroke color for default, up and negative point (#14826).'
    );

    chart.update({
        tooltip: {
            split: true
        }
    });

    assert.deepEqual(
        getTooltipStrokes(chart, chart.series[0].points, true),
        [upColor, color, upColor, negativeColor],
        'Split tooltip should have appropriate stroke color for default, up and negative point (#14826).'
    );

    points[0].update([3, 5.5, 6, 3, 4.5]);
    assert.strictEqual(
        points[0].graphic.attr('fill'),
        color,
        '#15849: Point fill should use series color after updating from up to down'
    );
    assert.strictEqual(
        points[0].color,
        color,
        '#15849: Point should use series color after updating from up to down'
    );
});
