QUnit.test('Series shadows', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [{
                shadow: {
                    color: 'red',
                    width: 10,
                    offsetX: 40,
                    offsetY: -20,
                    opacity: 0.05
                },
                data: [29, 71, 106, 129, 144]
            }]
        }),
        attributes = [
            'stroke="blue"',
            'stroke-opacity="0.2"',
            'transform="translate(0, 20)'
        ],
        result = true,
        outerHTML,
        shadows;

    chart.series[0].update({
        shadow: {
            width: 20,
            offsetY: 20,
            color: 'blue',
            opacity: 0.2,
            offsetX: 0
        }
    });

    shadows = chart.series[0].graph.shadows;
    outerHTML = shadows[shadows.length - 1].outerHTML;
    attributes.forEach(function (attr) {
        if (outerHTML.indexOf(attr) === -1) {
            result = false;
        }
    });

    assert.ok(
        result,
        'Shadows should be updated (#12091).'
    );

    assert.strictEqual(
        shadows.length,
        20,
        'Shadows amount should be correct (#12091).'
    );
});
