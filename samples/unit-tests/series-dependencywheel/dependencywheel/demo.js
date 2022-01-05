QUnit.test('Dependency wheel', function (assert) {
    const chart = Highcharts.chart('container', {
        series: [{
            keys: ['from', 'to', 'weight'],
            data: [
                ['Canada', 'Portugal', 1],
                ['Mexico', 'Portugal', 1],
                ['USA', 'Portugal', 1],
                ['USA', 'England', 5],
                ['Portugal', 'Angola', 2],
                ['Portugal', 'South Africa', 3],
                ['France', 'Angola', 1],
                ['France', 'Senegal', 3],
                ['France', 'Mali', 3],
                ['France', 'Morocco', 3],
                ['France', 'South Africa', 1],
                ['Spain', 'Senegal', 1]
            ],
            type: 'dependencywheel',
            dataLabels: {
                color: '#000',
                textPath: {
                    enabled: true,
                    attributes: {
                        dy: 5
                    }
                },
                distance: 10,
                style: {
                    textOverflow: 'ellipsis'
                }
            }
        }]
    });

    assert.strictEqual(
        chart.series[0].points[0].fromNode.dataLabel.text.element.textContent,
        'CanadaC…',
        `When the data label is longer than the available space the 'ellipsis'
        should be applied, #11115.`
    );
});
