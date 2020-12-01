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

        var sColumn = chart.series[1];
        seriesNegColor = Highcharts.color(sColumn.options.negativeColor)
            .brighten(0.1)
            .get();
        seriesPosColor = Highcharts.color(sColumn.options.color)
            .brighten(0.1)
            .get();
        $.each(sColumn.points, function (j, point) {
            point.setState('hover');
            pointColor = Highcharts.color(point.graphic.attr('fill'))
                .brighten(sColumn.options.brightness)
                .get();
            assert.strictEqual(
                point.y <= 0 ?
                    pointColor === seriesNegColor :
                    pointColor === seriesPosColor,
                true,
                'Color matched with options (column)'
            );
        });

        var sLine = chart.series[0];
        seriesNegColor = Highcharts.color(sLine.options.negativeColor).get();
        seriesPosColor = Highcharts.color(sLine.options.color).get();
        $.each(sLine.points, function (j, point) {
            point.setState('hover');
            pointColor = Highcharts.color(point.graphic.attr('fill')).get();
            assert.strictEqual(
                point.y <= 0 ?
                    pointColor === seriesNegColor :
                    pointColor === seriesPosColor,
                true,
                'Color matched with options (series with marker)'
            );
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
                'Color matched with options (series with marker and hover.fillColor)'
            );
        });
    }
);
