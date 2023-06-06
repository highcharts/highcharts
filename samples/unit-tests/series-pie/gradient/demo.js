QUnit.test('Pie radial gradient (#3801)', function (assert) {
    const colors = Highcharts.defaultOptions.colors;
    // Radialize the colors
    Highcharts.setOptions({
        colors: Highcharts.getOptions().colors.map(() =>
            ({
                radialGradient: {
                    cx: 0.5,
                    cy: 0.5,
                    r: 0.7
                },
                stops: [
                    [0, '#FFFFFF'],
                    [0.2, '#000000']
                ]
            })
        )
    });

    // Build the chart
    $('#container').highcharts({
        chart: {
            type: 'pie',
            width: 300,
            height: 300
        },
        series: [
            {
                data: [1, 1, 1, 1],
                dataLabels: {
                    enabled: false
                }
            }
        ]
    });

    var chart = $('#container').highcharts(),
        series = chart.series[0],
        gradient;

    gradient = series.points[0].graphic.element.getAttribute('fill'); // url()
    gradient = gradient.replace('url(#', '').replace(')', '');
    gradient = document.getElementById(gradient);

    assert.strictEqual(
        parseFloat(gradient.getAttribute('cx')),
        series.center[0],
        'Initially, gradient is centered'
    );

    assert.strictEqual(
        parseFloat(gradient.getAttribute('cy')),
        series.center[1],
        'Initially, gradient is centered'
    );

    chart.setSize(400, 400, false);

    assert.strictEqual(
        parseFloat(gradient.getAttribute('cx')),
        series.center[0],
        'After redraw, gradient is centered'
    );

    assert.strictEqual(
        parseFloat(gradient.getAttribute('cy')),
        series.center[1],
        'After redraw, gradient is centered'
    );

    assert.strictEqual(
        Highcharts.format('fill="{point.color}"', { point: series.points[0] }),
        'fill="url(#' +
            document.querySelector('#container svg defs radialGradient').id +
        ')"',
        'Gradient should be preserved in string handling (#2995)'
    );

    Highcharts.setOptions({
        colors
    });
});
