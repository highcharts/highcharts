QUnit.test(
    'Negative color shoud be respected for hover state (#3636)',
    function (assert) {
        var chart = $('#container')
                .highcharts({
                    series: [
                        {
                            color: '#FF0000',
                            negativeColor: '#0066CC',
                            data: [-15, 15]
                        },
                        {
                            color: '#FF0000',
                            negativeColor: '#0066CC',
                            type: 'column',
                            data: [10, -10]
                        },
                        {
                            color: '#FF0000',
                            negativeColor: '#0066CC',
                            data: [15, -15],
                            marker: {
                                states: {
                                    hover: {
                                        fillColor: '#ff00ff'
                                    }
                                }
                            }
                        }
                    ]
                })
                .highcharts(),
            seriesNegColor,
            seriesPosColor,
            pointColor;

        const sColumn = chart.series[1],
            brightness = sColumn.options.states.hover.brightness;
        seriesNegColor = Highcharts.color(sColumn.options.negativeColor)
            .brighten(brightness)
            .get();
        seriesPosColor = Highcharts.color(sColumn.options.color)
            .brighten(brightness)
            .get();
        $.each(sColumn.points, function (j, point) {
            point.setState('hover');
            pointColor = Highcharts.color(point.graphic.attr('fill'))
                .brighten(sColumn.options.brightness)
                .get();
            if (point.y <= 0) {
                assert.strictEqual(
                    pointColor,
                    seriesNegColor,
                    'Color matched with options (negative column)'
                );
            } else {
                assert.strictEqual(
                    pointColor,
                    seriesPosColor,
                    'Color matched with options (positive column)'
                );
            }
        });

        var sLine = chart.series[0];
        seriesNegColor = Highcharts.color(sLine.options.negativeColor).get();
        seriesPosColor = Highcharts.color(sLine.options.color).get();
        $.each(sLine.points, function (j, point) {
            point.setState('hover');
            pointColor = Highcharts.color(point.graphic.attr('fill')).get();
            if (point.y <= 0) {
                assert.strictEqual(
                    pointColor,
                    seriesNegColor,
                    'Color matched with options (line with negative color)'
                );
            } else {
                assert.strictEqual(
                    pointColor,
                    seriesPosColor,
                    'Color matched with options (line with positive color)'
                );
            }
        });

        // Higher priority for states.fillColor than series.negativeColor
        sLine = chart.series[2];
        seriesPosColor = Highcharts.color(
            sLine.options.marker.states.hover.fillColor
        ).get();
        $.each(sLine.points, function (j, point) {
            point.setState('hover');
            pointColor = Highcharts.color(point.graphic.attr('fill')).get();
            assert.strictEqual(
                pointColor === seriesPosColor,
                true,
                'Color matched with options (series with marker and ' +
                'hover.fillColor)'
            );
        });
    }
);
