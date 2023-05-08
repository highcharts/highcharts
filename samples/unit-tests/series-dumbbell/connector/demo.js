QUnit.test('Dumbbell connectors', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'dumbbell'
        },
        series: [
            {
                data: [
                    [4, 10],
                    [2, 10],
                    [3, 6]
                ]
            }
        ]
    });

    chart.series[0].points.forEach(function (point) {
        assert.strictEqual(
            typeof point.connector.element.getAttribute('d'),
            'string',
            'First point should have connector.'
        );
    });

    chart.series[0].points[0].update({
        connectorColor: 'red'
    });

    assert.strictEqual(
        chart.series[0].points[0].connector.element.getAttribute('stroke'),
        'red',
        'After update, the connector color should be changed.'
    );

    chart.series[0].addPoint({
        low: 3,
        high: 10,
        color: 'green',
        connectorWidth: 3
    });

    assert.strictEqual(
        chart.series[0].points[3].connector.element.getAttribute('stroke'),
        'green',
        'Added point\'s connector should have correct color.'
    );

    assert.strictEqual(
        chart.series[0].points[3].connector.element.getAttribute(
            'stroke-width'
        ),
        '3',
        'Added point\'s connector should have correct width.'
    );

    chart.addSeries({
        data: [
            [1, 5],
            [1, 6]
        ],
        connectorColor: 'blue'
    });

    const assertDestruction = msg => {
        var point = chart.series[1].points[0],
            lowerGraphic = point.lowerGraphic,
            upperGraphic = point.upperGraphic,
            connector = point.connector,
            pointGraphics = [lowerGraphic, upperGraphic, connector];

        point.remove();

        pointGraphics.forEach(function (graphic) {
            assert.strictEqual(
                graphic && graphic.element,
                undefined,
                msg
            );
        });
    };

    assertDestruction('All point\'s graphics should be removed.');

    chart.series[1].update({
        marker: {
            enabled: false
        }
    });

    assertDestruction('#15560: All point graphics should be destroyed when markers are disabled');
});
