(async () => {

    const mapData = await fetch(
        'https://code.highcharts.com/mapdata/custom/europe.topo.json'
    ).then(response => response.json());

    QUnit.test('Flowmap API options.', assert => {
        const chart = Highcharts.mapChart('container', {
            series: [{
                mapData
            }, {
                type: 'mappoint',
                data: [{
                    id: 'Vik i Sogn',
                    lat: 61.087220,
                    lon: 6.579700
                }, {
                    id: 'Krakow',
                    lon: 19.944981,
                    lat: 50.064651
                }]
            }, {
                type: 'flowmap',
                keys: [
                    'from',
                    'to',
                    'weight',
                    'curveFactor',
                    'growTowards',
                    'markerEnd'
                ],
                showInLegend: true,
                data: [
                    ['Vik i Sogn', 'Krakow', 0.5, 3]
                ]
            }]
        });

        assert.notStrictEqual(
            chart.series[2].points[0].graphic.attr('visibility'),
            'hidden',
            'Flowmap point graphic should be visible.'
        );

        chart.series[2].addPoint(
            ['Krakow', 'Vik i Sogn', 0.5, 3, true, {
                enabled: true,
                height: 10,
                width: 10
            }]);

        const addedPoint = chart.series[2].points[1];

        addedPoint.setVisible(false);

        assert.strictEqual(
            addedPoint.graphic.attr('visibility'),
            'hidden',
            'Flowmap point graphic should be hidden.'
        );

        // curveFactor
        assert.strictEqual(
            addedPoint.options.curveFactor,
            3,
            'Flowmap point curveFactor value should be correct.'
        );

        // growTowards
        assert.strictEqual(
            addedPoint.growTowards,
            true,
            'Flowmap point should have growTowards property set.'
        );

        // markerEnd
        assert.strictEqual(
            addedPoint.markerEnd.enabled,
            true,
            'Flowmap point should have markerEnd.'
        );

        addedPoint.remove();

        assert.notOk(
            addedPoint.graphics,
            true,
            'After point.remove(), the flowmap point graphic should be destroyed.'
        );

        chart.series[2].remove();

        assert.strictEqual(
            chart.series.length,
            2,
            `After series.remove(), there should be only two series.`
        );

    });

})();