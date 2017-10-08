QUnit.test('#6574 - subtitle shouldn\'t be rendered outside the container', function (assert) {
    var chart = Highcharts.chart('container', {
            subtitle: {
                text: 'Subtitle',
                verticalAlign: 'bottom'
            },
            series: [{
                data: [50, 10]
            }]
        }),
        box = chart.subtitle.getBBox(true);

    assert.strictEqual(
        box.y + box.height <= chart.chartHeight + 2, // + 2 is for Chrome/Win
        true,
        'Subtitle rendered within the plotting area.'
    );
});