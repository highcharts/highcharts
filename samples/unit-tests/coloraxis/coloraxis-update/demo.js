QUnit.test('Color axis updates', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'heatmap',
            width: 500,
            height: 300
        },

        colorAxis: {
            min: 0
        },

        series: [{
            data: [
                [0, 0, 10],
                [0, 1, 19],
                [0, 2, 8],
                [0, 3, 24],
                [0, 4, 67],
                [1, 0, 92],
                [1, 1, 58],
                [1, 2, 78],
                [1, 3, 117],
                [1, 4, 48]
            ]
        }]
    });

    var plotHeight = chart.plotHeight;

    assert.ok(
        plotHeight > 100,
        'Ready'
    );

    chart.colorAxis[0].update({
        max: 500
    });

    assert.strictEqual(
        chart.plotHeight,
        plotHeight,
        'Geometry ok after update (#6025)'
    );

    // Trigger a chart.redraw
    chart.setSize(490);

    assert.strictEqual(
        chart.plotHeight,
        plotHeight,
        'Geometry ok after resize (#6025)'
    );

    // On Update, no memory leak in colorAxis.undefined.undefined.undefined...
    assert.strictEqual(
        chart.options.colorAxis.undefined,
        undefined,
        'No extra undefined properties after update'
    );
});

QUnit.test('Color axis update with responsive rules', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'heatmap',
            width: 600,
            height: 400
        },
        colorAxis: {
            min: 0
        },
        legend: {
            align: 'right',
            layout: 'vertical',
            margin: 0,
            verticalAlign: 'top',
            y: 25,
            symbolHeight: 280
        },
        series: [{
            data: [
                [0, 0, 10],
                [0, 1, 19],
                [0, 2, 8],
                [0, 3, 24],
                [0, 4, 67],
                [1, 0, 92],
                [1, 1, 58],
                [1, 2, 78],
                [1, 3, 117],
                [1, 4, 48]
            ]
        }],
        responsive: {
            rules: [{
                condition: { maxWidth: 500 },
                chartOptions: {
                    legend: {
                        align: 'center',
                        verticalAlign: 'bottom',
                        layout: 'horizontal',
                        symbolHeight: 10,
                        y: 15
                    }
                }
            }]
        }
    });

    chart.setSize(500, 400);

    assert.strictEqual(
        chart.colorAxis[0].labelAlign,
        'center',
        'Labels are not misaligned'
    );
});
