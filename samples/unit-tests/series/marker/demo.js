QUnit.test("Marker should not move after hover(#4586)", function (assert) {
    var chart = $('#container').highcharts({
        plotOptions: {
            series: {
                states: {
                    hover: {
                        enabled: false
                    }
                }
            }
        },

        series: [
            {
                lineWidth: 0,
                marker: {
                    symbol: 'circle',
                    radius: 47,
                    lineWidth: 2,
                    lineColor: 'green',
                    fillColor: 'rgba(0,0,0,0)'
                },
                data: [
                    {
                        x: 3.2,
                        y: 5.3
                    },
                    {
                        x: 6.1,
                        y: 6.4
                    },
                    {
                        x: 9.0,
                        y: 7.0
                    },
                    {
                        x: 11.9,
                        y: 8.1
                    },
                    {
                        x: 14.7,
                        y: 9.7
                    }
                ]
            }
        ]
    }).highcharts();

    var markerX = chart.series[0].points[1].graphic.attr('x');

    chart.series[0].points[1].onMouseOver();
    chart.series[0].points[1].onMouseOut();
    assert.strictEqual(
        chart.series[0].points[1].graphic.attr('x'),
        markerX,
        'Correct position'
    );

});

QUnit.test('Marker size and position', function (assert) {
    var series = Highcharts.chart('container', {
        chart: {
            animation: false
        },
        accessibility: {
            enabled: false // A11y forces markers
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

    // Shared graphic position (#7273)
    series.update({
        marker: {
            enabled: false,
            symbol: 'url(https://www.highcharts.com/samples/graphics/sun.png)'
        }
    });

    series.points[1].setState('hover');

    assert.strictEqual(
        Math.floor(series.points[1].plotX),
        series.stateMarkerGraphic.attr('x'),
        'Correct image x-position (#7273)'
    );

    assert.strictEqual(
        Math.floor(series.points[1].plotY),
        Math.floor(series.stateMarkerGraphic.attr('y')),
        'Correct image y-position (#7273)'
    );

});

QUnit.test('visibility', assert => {
    const axisHeight = 150;
    const data = [85, 82, 84, 87, 92];
    const {
        series: [series1, series2],
        yAxis: [/* yAxis1 */, yAxis2]
    } = Highcharts.stockChart('container', {
        // NOTE: Disable a11y, because it affects stateMarkerGraphic in Karma.
        accessibility: {
            enabled: false
        },
        chart: {
            height: axisHeight * 3
        },
        tooltip: {
            split: true
        },
        yAxis: [{
            height: axisHeight,
            top: 0,
            offset: 0
        }, {
            opposite: false,
            height: axisHeight,
            top: axisHeight,
            offset: 0
        }],
        rangeSelector: {
            enabled: false
        },
        navigator: {
            enabled: false
        },
        scrollbar: {
            enabled: false
        },
        series: [{ data: data, yAxis: 0 }, { data: data, yAxis: 1 }]
    });

    yAxis2.setExtremes(85, 90);
    series1.points[2].onMouseOver();

    assert.ok(
        series1.stateMarkerGraphic,
        'Should have stateMarkerGraphic on Series 1'
    );
    assert.strictEqual(
        series1.stateMarkerGraphic.visibility,
        'visible',
        'Should have stateMarkerGraphic on Series 1 with visibility "visible"'
    );
    assert.ok(
        series2.stateMarkerGraphic,
        'Should have stateMarkerGraphic on Series 2'
    );
    assert.strictEqual(
        series2.stateMarkerGraphic.visibility,
        'hidden',
        'Should have stateMarkerGraphic on Series 2 with visibility "hidden" when point is outside extremes. #11493'
    );
});
