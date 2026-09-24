QUnit.test('Max point width', function (assert) {
    Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Max point width in Highcharts'
        },
        xAxis: {
            categories: ['One', 'Two', 'Three']
        },
        series: [
            {
                data: [1, 2, 3],
                maxPointWidth: 50
            }
        ]
    });

    var chart, point;

    chart = $('#container').highcharts();
    point = chart.series[0].points[0];

    assert.strictEqual(
        parseInt(point.graphic.attr('width'), 10) <= 50,
        true,
        'Column width less than 50'
    );

    // Now try a bar chart
    Highcharts.chart('container', {
        chart: {
            type: 'bar'
        },

        title: {
            text: 'Max point width in Highcharts'
        },

        xAxis: {
            categories: ['One', 'Two', 'Three']
        },

        series: [
            {
                data: [1, 2, 3],
                maxPointWidth: 50
            }
        ]
    });
    chart = $('#container').highcharts();
    point = chart.series[0].points[0];

    // The bar chart plot area is rotated 90 degrees, so we check the width
    // even though it
    // is the bar height we are testing.
    assert.strictEqual(
        parseInt(point.graphic.attr('width'), 10) <= 50,
        true,
        'Bar width (flipped) less than 50'
    );

    // maxPointWidth as a CSS expression (#23989)
    chart.renderTo.style.setProperty('--hc-max-point-width', '25px');
    chart.update({
        chart: {
            type: 'column'
        },
        series: [{
            pointWidth: 90,
            maxPointWidth: 'var(--hc-max-point-width)'
        }]
    });
    point = chart.series[0].points[0];

    assert.strictEqual(
        parseInt(point.graphic.attr('width'), 10),
        25,
        'maxPointWidth should cap pointWidth at the resolved pixel ' +
        'value when set via a CSS variable'
    );

    chart.renderTo.style.removeProperty('--hc-max-point-width');

    // Per-point pointWidth as a CSS expression (#23989)
    chart.renderTo.style.setProperty('--hc-point-width', '30px');
    chart.series[0].points[0].update({
        pointWidth: 'calc(var(--hc-point-width) * 2)'
    });

    assert.strictEqual(
        parseInt(chart.series[0].points[0].graphic.attr('width'), 10),
        60,
        'Per-point pointWidth should resolve to pixels when set via a ' +
        'CSS calc() expression'
    );

    chart.renderTo.style.removeProperty('--hc-point-width');
});
