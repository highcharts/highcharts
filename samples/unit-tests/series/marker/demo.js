QUnit.test('Marker should not move after hover(#4586)', function (assert) {
    var chart = $('#container')
        .highcharts({
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
        })
        .highcharts();

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
    let onlyOnce = true,
        now = false;

    const series = Highcharts.chart('container', {
        chart: {
            animation: false,
            events: {
                render() {
                    if (onlyOnce && now) {
                        onlyOnce = false;
                        this.series[0].update({
                            marker: {
                                width: 45,
                                height: 45
                            }
                        });

                        assert.deepEqual(
                            [
                                this.series[0].points[0].graphic.attr('width'),
                                this.series[0].points[0].graphic.attr('height')
                            ],
                            [45, 45],
                            `Markers should update their size on series update,
                            if the size was NOT initially set.`
                        );
                    }
                }
            }
        },
        accessibility: {
            enabled: false // A11y forces markers
        },
        series: [
            {
                data: [1, 2, 3],
                animation: false,
                marker: {
                    radius: 2.5,
                    animation: false,
                    states: {
                        hover: {
                            animation: false
                        }
                    }
                }
            }
        ]
    }).series[0];

    assert.strictEqual(
        series.points[0].graphic.x % 1,
        0,
        '#15179: Position should be a whole number because of crisping'
    );

    series.update({
        marker: {
            radius: 4
        }
    });

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
            plotOptions.line.marker.states.hover.radiusPlus) *
            2,
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
            symbol: 'url(https://www.highcharts.com/samples/graphics/sun.png)',
            radius: void 0
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

    assert.ok(
        series.stateMarkerGraphic.attr('class'),
        '#5430: State marker should have class set'
    );

    series.update({
        marker: {
            enabled: true
        }
    });

    // Run test from chart.events.render, #18305
    now = true;
    series.chart.redraw();

    series.update({
        marker: {
            width: 50,
            height: 50
        }
    });

    assert.deepEqual(
        [
            series.points[0].graphic.attr('width'),
            series.points[0].graphic.attr('height')
        ],
        [50, 50],
        `Markers should update their size on series update, if the size was
        initially set.`
    );
});

QUnit.test('visibility', assert => {
    const axisHeight = 150;
    const data = [85, 82, 84, 87, 92];
    const {
        series: [series1, series2],
        yAxis: [, /* yAxis1 */ yAxis2]
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
        yAxis: [
            {
                height: axisHeight,
                top: 0,
                offset: 0,
                allowDecimals: true
            },
            {
                opposite: false,
                height: axisHeight,
                top: axisHeight,
                offset: 0,
                allowDecimals: true
            }
        ],
        rangeSelector: {
            enabled: false
        },
        navigator: {
            enabled: false
        },
        scrollbar: {
            enabled: false
        },
        series: [
            { data: data, yAxis: 0 },
            { data: data, yAxis: 1 }
        ]
    });

    yAxis2.setExtremes(85, 90);
    series1.points[2].onMouseOver();

    assert.ok(
        series1.stateMarkerGraphic,
        'Should have stateMarkerGraphic on Series 1'
    );
    assert.strictEqual(
        series1.stateMarkerGraphic.visibility,
        'inherit',
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
