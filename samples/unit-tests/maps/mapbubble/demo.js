QUnit.test('MapBubble', function (assert) {
    const chart = Highcharts.mapChart('container', {
        chart: {
            map: 'countries/gb/gb-all'
        },
        colorAxis: {
            dataClasses: [{
                from: 0,
                to: 0,
                color: 'green'
            }]
        },
        series: [{

        }, {
            type: 'mapbubble',
            lineWidth: 2,
            colorKey: 'colorValue',
            data: [
                {
                    lat: 51.507222,
                    lon: -0.1275,
                    z: 3,
                    colorValue: 0
                },
                {
                    lat: 52.483056,
                    lon: -1.893611,
                    z: 4
                },
                {
                    x: 1600,
                    y: -3500,
                    z: 3
                },
                {
                    x: 2800,
                    y: -3800,
                    z: 1
                }
            ]
        }]
    });

    assert.strictEqual(
        chart.series[1].points[0].color,
        'green',
        'Color axis with colorKey should work'
    );

    // Passing the default joinBy value for MapBubbleSeries (#16750).
    assert.strictEqual(
        chart.series[1].joinBy[0],
        'hc-key',
        `The value of joinBy in the mapbubble series
        should be 'hc-key' by default.`
    );

    assert.strictEqual(
        chart.series[1].graph['stroke-width'],
        2,
        'MapBubble with linewidth- points should have stroke width.'
    );

    chart.series[1].update({
        joinBy: ['iso_3166_2', 'name']
    }, false);

    chart.series[1].addPoint({
        name: 'GB-AGY',
        z: 1000,
        color: 'red'
    });

    const addedPoint = chart.series[1].data[4];
    assert.ok(
        addedPoint.plotX !== undefined && addedPoint.plotY !== undefined,
        'Added point should be drawn (#16598).'
    );

    chart.update({
        tooltip: {
            shared: true
        }
    });
    // Hover over the chart.
    chart.pointer.runPointActions({ chartX: 200, chartY: 200 });
    assert.ok(
        true,
        `When hovering over mapbubble series with shared tooltip,
        there should be no errors in the console.`
    );

    // Remove one point from the mapbubble series (#17297).
    const origLength = chart.series[1].points.length;
    chart.series[1].points[1].remove();
    const newLength = chart.series[1].points.length;
    assert.strictEqual(
        newLength,
        origLength - 1,
        'The length of the points array should be shorter by 1 after poit.remove() (#17297)'
    );
});
