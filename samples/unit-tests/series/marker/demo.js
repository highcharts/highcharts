$(function () {

    QUnit.test('Marker size', function (assert) {
        var series = Highcharts.chart('container', {
            chart: {
                animation: false
            },
            series: [{
                data: [1, 2, 3],
                animation: false,
                marker: {
                    animation: false,
                    states: {
                        hover: {
                            animation: false
                        }
                    }
                }
            }]
        }).series[0];

        // Default size
        assert.strictEqual(
            series.points[0].graphic.attr('width'),
            Highcharts.getOptions().plotOptions.line.marker.radius * 2,
            'Initial width'
        );

        series.points[0].setState('hover');
        var plotOptions = Highcharts.getOptions().plotOptions;
        assert.strictEqual(
            series.points[0].graphic.attr('width'),
            (plotOptions.line.marker.radius +
                plotOptions.line.marker.states.hover.radiusPlus) * 2,
            'Hover width'
        );

        // Explicit radius
        series.points[0].setState(''); // reset
        series.update({
            marker: {
                radius: 10
            }
        });

        assert.strictEqual(
            series.points[0].graphic.attr('width'),
            2 * 10,
            'Greater width'
        );

        series.points[0].setState('hover');
        assert.strictEqual(
            series.points[0].graphic.attr('width'),
            (10 + plotOptions.line.marker.states.hover.radiusPlus) * 2,
            'Hover width'
        );

        // Individual point radius (#5817)
        series.addPoint({
            y: 4,
            marker: {
                radius: 20
            }
        });

        assert.strictEqual(
            series.points[3].graphic.attr('width'),
            2 * 20,
            'Individual width'
        );

        series.points[3].setState('hover');
        assert.strictEqual(
            series.points[3].graphic.attr('width'),
            (20 + plotOptions.line.marker.states.hover.radiusPlus) * 2,
            'Individual hover width'
        );
    });
});