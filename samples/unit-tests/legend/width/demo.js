QUnit.test('Legend width', function (assert) {
    const chart = Highcharts.chart('container', {
            chart: {
                width: 500
            },
            legend: {
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 1
            },
            series: [
                {
                    data: [6, 4, 2],
                    name: 'First'
                },
                {
                    data: [7, 3, 2],
                    name: 'Second'
                },
                {
                    data: [9, 4, 8],
                    name: 'Third'
                },
                {
                    data: [1, 2, 6],
                    name: 'Fourth'
                },
                {
                    data: [4, 6, 4],
                    name: 'Fifth'
                },
                {
                    data: [1, 2, 7],
                    name: 'Sixth'
                },
                {
                    data: [4, 2, 5],
                    name: 'Seventh'
                },
                {
                    data: [8, 3, 2],
                    name: 'Eighth'
                },
                {
                    data: [4, 5, 6],
                    name: 'Ninth'
                }
            ]
        }),
        legend = chart.legend;

    assert.ok(
        legend.legendWidth < 300,
        'The default legend width should not exceed half the chart width'
    );

    legend.update({
        title: {
            text: `This legend is long and caused overflow to both sides,
which aside from being bad as of itself had an additional side-effect of
cropping the legend as well.`
        }
    });

    assert.ok(
        legend.legendWidth < 300,
        'The default legend width should not exceed half the chart width'
    );

    chart.legend.update({
        verticalAlign: 'bottom'
    });
    assert.ok(legend.legendWidth > 300, 'The legend has redrawn');

    legend.update({ maxWidth: '20%' });

    const constrainedWidth = legend.legendWidth;

    assert.strictEqual(
        constrainedWidth < 300,
        true,
        'Legend width should have decreased by applying \´maxWidth\´'
    );

    legend.update({ maxWidth: '100%', width: 100 });

    assert.strictEqual(
        legend.legendWidth,
        constrainedWidth,
        'Legend maxWidth of 20% should result in same width as width: 100'
    );
});
