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
                        id: 'BBB'
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

        assert.strictEqual(
            series.data[1].dataLabel.visibility,
            'hidden',
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
    }
);
