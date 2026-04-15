QUnit.test(
    'Axis extremes after zooming or drillToNode in Treemap (#4856)',
    function (assert) {
        const chart = Highcharts.chart('container', {
                chart: {
                    zoomType: 'xy'
                },
                colorAxis: {
                    minColor: '#FFFFFF',
                    maxColor: Highcharts.getOptions().colors[0]
                },
                series: [
                    {
                        type: 'treemap',
                        layoutAlgorithm: 'squarified',
                        data: [
                            {
                                id: 'A',
                                name: 'A',
                                value: 6,
                                colorValue: 1
                            },
                            {
                                name: 'B',
                                value: 3,
                                colorValue: 2
                            },
                            {
                                name: 'C',
                                value: 3,
                                colorValue: 3
                            },
                            {
                                parent: 'A',
                                name: 'A1',
                                value: 3,
                                colorValue: 4
                            },
                            {
                                parent: 'A',
                                name: 'A2',
                                value: 2,
                                colorValue: 5
                            }
                        ]
                    }
                ],
                title: {
                    text: 'Highcharts Treemap'
                }
            }),
            xAxis = chart.xAxis[0],
            points = chart.series[0].points;
        let extremes;

        // Zoom should work when enabled
        xAxis.setExtremes(80, 100);
        chart.redraw();
        extremes = xAxis.getExtremes();
        assert.strictEqual(
            extremes.min,
            80,
            'xAxis.min is correct according to zoom'
        );
        assert.strictEqual(
            extremes.max,
            100,
            'xAxis.max is correct according to zoom'
        );

        assert.ok(
            points[1].dataLabel.visibility === 'hidden' &&
            points[1].dataLabel.getStyle('visibility') === 'hidden',
            'Data label outside of zoomed range should not be visible, #24220.'
        );

        assert.strictEqual(
            points[2].dataLabel.visibility,
            'inherit',
            'Data label inside of zoomed range should be visible, #24220.'
        );

        assert.strictEqual(
            points[2].dataLabel.getStyle('visibility'),
            'visible',
            'Data label inside of zoomed range should be visible, #24220.'
        );

        // When allowDrillToNode the extremes should be the same as the point
        // values of the root node.
        chart.series[0].update({
            allowDrillToNode: true
        });
        chart.series[0].setRootNode('A');
        extremes = xAxis.getExtremes();
        assert.strictEqual(
            Highcharts.correctFloat(extremes.min),
            0,
            'xAxis.min is matching the root node'
        );
        assert.strictEqual(
            Highcharts.correctFloat(extremes.max),
            50,
            'xAxis.max is matching the root node'
        );

        // When allowDrillToNode extremes should be unaffected by zoom.
        xAxis.setExtremes(80, 100);
        extremes = xAxis.getExtremes();
        assert.strictEqual(
            Highcharts.correctFloat(extremes.min), 0,
            'xAxis.min is unaffected by zoom'
        );
        assert.strictEqual(
            Highcharts.correctFloat(extremes.max), 50,
            'xAxis.max is unaffected by zoom'
        );
        chart.series[0].setRootNode('');

        chart.series[0].update({
            interactByLeaf: true,
            traverseToLeaf: true
        });

        chart.series[0].points[3].onMouseOver();
        chart.pointer.onContainerClick({
            target: chart.series[0].points[3].graphic.element
        });

        assert.strictEqual(
            chart.series[0].points[3].id,
            chart.series[0].rootNode,
            'Zoomed-into root node should be the last leaf, #20624.'
        );
    }
);
