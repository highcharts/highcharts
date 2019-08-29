QUnit.test('Organization data', assert => {
    const chart = Highcharts.chart('container', {
        series: [{
            type: 'organization',
            keys: ['from', 'to'],
            data: [
                ["44", "8"],
                ["8", "13"],
                ["44", "43"],
                ["43", "10"],
                // Error:
                ["13", "10"]
            ]
        }]
    });

    assert.strictEqual(
        chart.series[0].nodes[4].graphic.element.getAttribute('fill'),
        Highcharts.defaultOptions.colors[4],
        'The last element should be rendered and filled accoring to colorByPoint'
    );
});
