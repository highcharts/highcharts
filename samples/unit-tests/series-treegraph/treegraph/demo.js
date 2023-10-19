QUnit.test('Treegraph series',
    function (assert) {
        const chart = Highcharts.chart('container', {
                series: [{
                    type: 'treegraph',
                    data: [{
                        id: 'A',
                        collapsed: true
                    }, {
                        parent: 'A',
                        id: 'B'
                    }],
                    dataLabels: {
                        pointFormat: '{point.id}'
                    },
                    levels: [{
                        level: 2,
                        marker: {
                            symbol: 'url(https://www.highcharts.com/samples/graphics/sun.png)'
                        }
                    }]
                }]
            }),
            series = chart.series[0];

        assert.strictEqual(
            series.points[0].plotX,
            0,
            'The point A should be X positioned on 0 (#19038)'
        );

        series.update({
            fillSpace: true
        });

        assert.notEqual(
            series.points[0].plotX,
            0,
            'The point A should not be X positioned on 0 (#19038)'
        );

        assert.ok(
            !series.data[1].dataLabel ||
                series.data[1].dataLabel.visibility === 'hidden',
            'Hidden points should have hidden data labels (#18891)'
        );

        series.data[0].update({
            collapsed: false
        });

        assert.strictEqual(
            series.data[1].dataLabel.visibility,
            'inherit',
            'Visible points should have visible data labels (#18891)'
        );

        assert.strictEqual(
            series.points[1].graphic.element.nodeName,
            'image',
            'The SVG element of the second point should be an image (#19173)'
        );

        series.setData([{
            id: 'A'
        },  {
            parent: 'A',
            id: 'CCC'
        }, {
            parent: 'A',
            id: 'DDD'
        }]);

        assert.strictEqual(
            document.querySelectorAll('.highcharts-treegraph-series>.highcharts-point').length,
            2,
            'Correct amount of links after setData (#19524)'
        );

        assert.notOk(
            series.links.find(
                link => link.options.parent === 'A' && link.options.id === 'BBB'
            ),
            'Removed the link from A to BBB (#19524)'
        );

        series.update({
            marker: {
                radius: 20
            },
            levels: [
                {
                    level: 1
                }, {
                    level: 2,
                    collapsed: true
                },
                {
                    level: 3,
                    collapsed: true
                }
            ],
            type: 'treegraph',
            keys: ['id', 'parent'],
            data: [
                ['A'],
                ['B', 'A'],
                ['C', 'B'],
                ['D', 'C']
            ],
            dataLabels: {
                format: '{point.id}'
            }
        });

        let collapseButtonOpacity =
            series.data[2].collapseButton && series.data[2].collapseButton.attr('opacity');

        assert.strictEqual(
            collapseButtonOpacity,
            0,
            'CollapseButton should be hidden when point is collapsed (#19368).'
        );

        series.data[1].update({
            collapsed: false
        });

        collapseButtonOpacity =
            series.data[2].collapseButton && series.data[2].collapseButton.attr('opacity');

        assert.strictEqual(
            collapseButtonOpacity,
            1,
            'CollapseButton should be visible when point is expanded (#19368).'
        );

        series.update({
            showInLegend: true,
            legendSymbol: 'lineMarker'
        });

        assert.ok(
            chart.series[0].legendItem.symbol.element &&
            chart.series[0].legendItem.line.element,
            `Legend symbol and line should be rendered when
            legendSymbol is set to lineMarker (#19671).`
        );

        const seriesData = [
            ['Parent element', undefined],
            ['Nested element 1', 'Parent element'],
            ['Nested element 2', 'Parent element']
        ];

        chart.addSeries({
            type: 'treegraph',
            keys: ['id', 'parent'],
            data: []
        });

        for (let i = 0; i < 3; i++) {
            chart.series[1].addPoint(seriesData[i]);
        }

        assert.deepEqual(
            seriesData,
            chart.userOptions.series[1].data.map(point => ([
                point.id || point[0], point.parent || point[1]
            ])),
            'The initial data should match the rendered data (#19552).'
        );
    }
);
