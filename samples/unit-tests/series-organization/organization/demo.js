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

QUnit.test('Organization single data', assert => {
    const chart = Highcharts.chart('container', {
        series: [{
            type: 'organization',
            keys: ['from', 'to'],
            data: [
                ['hey', 'hey']
            ]
        }]
    });

    assert.strictEqual(
        chart.series[0].nodes.length,
        1,
        'A single-node series should be possible (#11792)'
    );
    assert.strictEqual(
        chart.container.innerHTML.indexOf('NaN'),
        -1,
        'The SVG should not contain NaN'
    );
});
