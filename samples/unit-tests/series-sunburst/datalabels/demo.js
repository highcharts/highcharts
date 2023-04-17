QUnit.test('Rotation mode', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [
            {
                type: 'sunburst',
                data: [
                    {
                        id: 'root'
                    },
                    {
                        parent: 'root',
                        name: 'First<br>item',
                        value: 1
                    },
                    {
                        parent: 'root',
                        name: 'Second',
                        value: 1
                    },
                    {
                        parent: 'root',
                        name: 'Third',
                        value: 1
                    },
                    {
                        parent: 'root',
                        name: 'Fourth',
                        value: 1
                    },
                    {
                        parent: 'root',
                        name: 'Fifth',
                        value: 1
                    },
                    {
                        parent: 'root',
                        name: 'Sixth',
                        value: 1
                    },
                    {
                        parent: 'root',
                        name: 'Second',
                        value: 1
                    },
                    {
                        parent: 'root',
                        name: 'Eight',
                        value: 1
                    }
                ]
            }
        ]
    });

    assert.deepEqual(
        chart.series[0].points.map(point => typeof point.dataLabel.textPath),
        [
            'undefined',
            'object',
            'object',
            'object',
            'object',
            'object',
            'object',
            'object',
            'object'
        ],
        'Auto rotationMode should be circular'
    );

    assert.strictEqual(
        chart.series[0].points[1].dataLabel.element
            .querySelector('.highcharts-text-outline')
            .getAttribute('y'),
        null,
        'The y attribute should not be set on text outline element (#17677)'
    );

    chart.series[0].update({
        dataLabels: {
            rotationMode: 'perpendicular'
        }
    });
    assert.deepEqual(
        chart.series[0].points.map(function (point) {
            return Number(point.dataLabel.rotation.toFixed(1));
        }),
        [90, -67.5, -22.5, 22.5, 67.5, -67.5, -22.5, 22.5, 67.5],
        'rotationMode should be perpendicular'
    );

    chart.series[0].update({
        dataLabels: {
            rotationMode: 'parallel'
        }
    });
    assert.deepEqual(
        chart.series[0].points.map(function (point) {
            return Number(point.dataLabel.rotation.toFixed(1));
        }),
        [0, 22.5, 67.5, -67.5, -22.5, 22.5, 67.5, -67.5, -22.5],
        'rotationMode should be parallel'
    );

    chart.series[0].update({
        dataLabels: {
            rotationMode: 'auto'
        }
    });
    chart.series[0].points[1].update(4);
    assert.deepEqual(
        chart.series[0].points.map(function (point) {
            return Number(point.dataLabel.rotation.toFixed(1));
        }),
        [0, 65.5, 57.3, -90, -57.3, -24.5, 8.2, 40.9, 73.6],
        'Different sized points should give different rotation'
    );
});
