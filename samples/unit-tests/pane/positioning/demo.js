QUnit.test('Pane positioning', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            animation: false,
            plotBorderWidth: 1,
            height: 350
        },

        pane: {
            startAngle: -90,
            endAngle: 90,
            background: [{
                outerRadius: '100%',
                innerRadius: '60%',
                _shape: 'arc'
            }],
            margin: 0,
            size: undefined,
            center: undefined
        },

        yAxis: {
            min: 0,
            max: 100
        },

        series: [
            {
                type: 'gauge',
                data: [70],
                animation: false
            }
        ]
    });

    const pane = chart.pane[0];

    assert.strictEqual(
        pane.center[1],
        // center[2] is the diameter
        pane.center[2] / 2,
        'Pane should be aligned to the top'
    );

    assert.ok(
        pane.center[1] < chart.plotHeight - 30,
        'Pane center should be a bit above plot height to make room for label'
    );

    pane.update({
        size: '100%',
        startAngle: 0,
        endAngle: 360
    });

    assert.close(
        pane.center[1],
        chart.plotHeight / 2,
        1,
        'Pane should be vertically centered with explicit size'
    );

    pane.update({
        size: '80%'
    });

    assert.close(
        pane.center[1],
        chart.plotHeight / 2,
        1,
        'Pane should be vertically centered with explicit size'
    );

    pane.update({
        size: undefined,
        startAngle: -120,
        endAngle: 120,
        background: [{
            shape: 'circle',
            outerRadius: '100%'
        }]
    });

    assert.close(
        pane.center[1],
        chart.plotHeight / 2,
        1,
        'Circle background should fill out the plot area'
    );
});