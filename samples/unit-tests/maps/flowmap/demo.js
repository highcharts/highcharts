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
                    id: 'A',
                    lat: 50,
                    lon: 0
                }, {
                    id: 'B',
                    lon: 20,
                    lat: 50
                }, {
                    id: 'C',
                    lon: 30,
                    lat: 40
                }]
            }, {
                type: 'flowmap',
                linkedTo: ':previous',
                // keys: [
                //     'from',
                //     'to',
                //     'weight',
                //     'curveFactor',
                //     'growTowards',
                //     'markerEnd'
                // ],
                data: [{
                    from: 'A',
                    to: 'B',
                    weight: 1
                }]
            }]
        });

        const series = chart.series[2];

        // Test curveFactor

        assert.strictEqual(
            series.points[0].shapeArgs.d[0][2],
            series.points[0].shapeArgs.d[1][2],
            `Based on 2 points with the same lat, the arrow should be
            horizontal (no curve).`
        );

        series.points[0].update({
            curveFactor: 1
        });

        assert.notStrictEqual(
            series.points[0].shapeArgs.d[0][2],
            series.points[0].shapeArgs.d[1][2],
            `Based on 2 points with the same lat, the arrow should no longer be
            horizontal (curved).`
        );

        // Test weight

        series.addPoint({
            from: 'B',
            to: 'C'
        });

        assert.strictEqual(
            series.points[1].shapeArgs.d.length,
            0,
            `The point without a weight defined on a point or series level
            should not be drawn.`
        );

        series.points[1].update({
            weight: 1
        });

        assert.strictEqual(
            series.points[1].shapeArgs.d.length,
            8,
            `The point with a weight defined on a point level should be drawn.`
        );

        series.points[1].update({
            weight: null
        });

        assert.strictEqual(
            series.points[1].shapeArgs.d.length,
            0,
            `The point without a weight defined on a point or series level
            should not be drawn.`
        );

        series.update({
            weight: 1
        });

        assert.strictEqual(
            series.points[1].shapeArgs.d.length,
            8,
            `The point with a weight defined on a series level should be drawn.`
        );

        // Test style attribs

        assert.strictEqual(
            series.points[1].graphic.attr('fill'),
            chart.options.colors[series.index],
            `The point with a weight defined on a series level should be drawn.`
        );

        // assert.strictEqual(
        //     series.points[1].graphic.attr('fillOpacity'),
        //     series.options.fillOpacity,
        //     `The point with a weight defined on a series level should be drawn.`
        // );

        // assert.notStrictEqual(
        //     series.points[1].color,
        //     series.options.nullColor,
        //     `The not-null point should have a correct color in options.`
        // );

        assert.strictEqual(
            series.points[1].graphic.attr('stroke'),
            series.points[1].color,
            `The point's stroke color should be correct.`
        );

        // series.points[1].setVisible(false);

        // // assert.strictEqual(
        // //     addedPoint.graphic.attr('visibility'),
        // //     'hidden',
        // //     'Flowmap point graphic should be hidden.'
        // // );

        const pointToRemove = series.points[1];

        pointToRemove.remove();

        assert.notOk(
            pointToRemove.graphics,
            true,
            'After point.remove(), the point graphic should be destroyed.'
        );

        assert.strictEqual(
            series.points.length,
            1,
            'After point.remove(), there should be only one point left.'
        );

        chart.series[2].remove();

        assert.strictEqual(
            chart.series.length,
            2,
            `After series.remove(), there should be only two series.`
        );

    });

})();