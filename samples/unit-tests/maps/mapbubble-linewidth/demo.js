QUnit.test('MapBubble', function (assert) {
    const chart = Highcharts.mapChart('container', {
        series: [
            {
                mapData: Highcharts.maps['countries/gb/gb-all']
            },
            {
                type: 'mapbubble',
                lineWidth: 2,
                data: [
                    {
                        lat: 51.507222,
                        lon: -0.1275,
                        z: 3
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
            }
        ]
    });

    assert.strictEqual(
        chart.series[1].graph['stroke-width'],
        2,
        'MapBubble with linewidth- points should have stroke width.'
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

    // Passing the default joinBy value for MapBubbleSeries (#16750).
    assert.strictEqual(
        chart.series[1].joinBy[0],
        'hc-key',
        `The value of joinBy in the mapbubble series 
        should be 'hc-key' by default.`
    );
});
