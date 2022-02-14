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
            type: 'dependencywheel'
        }]
    });

    assert.strictEqual(
        chart.series[0].nodes[0].dataLabel.attr('rotation'),
        0,
        `Initially, the labels should not be rotated.`
    );
    assert.strictEqual(
        chart.series[0].points[0].fromNode.dataLabel.text.textStr,
        'Canada',
        'Initially, the labels should not be cropped.'
    );

    chart.series[0].update({
        dataLabels: {
            rotationMode: 'perpendicular'
        }
    });
    assert.close(
        chart.series[0].nodes[0].dataLabel.attr('rotation'),
        -90,
        5,
        'Defining the rotationMode should result in rotating the label.'
    );
    assert.strictEqual(
        chart.series[0].points[0].fromNode.dataLabel.textStr,
        'Canada',
        'When the rotationMode is defined, the labels should not be cropped.'
    );

    chart.series[0].update({
        dataLabels: {
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
    });
    assert.strictEqual(
        chart.series[0].points[0].fromNode.dataLabel.text.element.textContent,
        'CanadaC…',
        `When the data label is longer than the available space the 'ellipsis'
        should be applied, #11115.`
    );
});
