QUnit.test(
    'Negative color should be updated with point\'s value (#4267)',
    function (assert) {
        const color = '#00ff00',
            negativeColor = '#ff0000',
            chart = Highcharts.chart('container', {
                series: [
                    {
                        type: 'column',
                        data: [5, 10, -5, -10],
                        color: color,
                        negativeColor: negativeColor
                    }
                ]
            }),
            points = chart.series[0].points;

        chart.series[0].setData([5, -10, -5, 10]);

        assert.strictEqual(
            points[0].graphic.attr('fill'),
            color,
            'Positive color'
        );
        assert.strictEqual(
            points[1].graphic.attr('fill'),
            negativeColor,
            'Negative color'
        );
        assert.strictEqual(
            points[2].graphic.attr('fill'),
            negativeColor,
            'Negative color'
        );
        assert.strictEqual(
            points[3].graphic.attr('fill'),
            color,
            'Positive color'
        );

        const negativeArrBefore = chart.series[0].points.map(function (p) {
            return p.negative;
        });

        chart.series[0].update({
            zoneAxis: 'x'
        });

        assert.deepEqual(
            chart.series[0].points.map(function (p) {
                return p.negative;
            }),
            negativeArrBefore,
            `After changing the zonesAxis property point.negative properties
            shouldn't be changed (#19028).`
        );
    }
);
