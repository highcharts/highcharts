QUnit.test(
    'PlotBand should be rendered above the frames (#4889)',
    function (assert) {
        var chart = new Highcharts.Chart({
            chart: {
                renderTo: 'container',
                type: 'column',
                margin: 75,
                options3d: {
                    enabled: true,
                    alpha: 15,
                    beta: 15,
                    depth: 50,
                    viewDistance: 25,
                    frame: {
                        back: {
                            color: 'rgba(255, 0, 0, 1)'
                        },
                        side: {
                            color: 'rgba(255, 0, 0, 1)'
                        },
                        bottom: {
                            color: 'rgba(255, 0, 0, 1)'
                        }
                    }
                }
            },
            yAxis: {
                plotLines: [
                    {
                        color: 'black',
                        value: 50,
                        width: 5
                    }
                ]
            },
            plotOptions: {
                column: {
                    depth: 25
                }
            },
            series: [
                {
                    data: [50, 100]
                }
            ]
        });

        var plotBandZIndex = parseFloat(
                chart.yAxis[0].plotLinesAndBands[0].svgElem.attr('zIndex'),
                10
            ),
            backFrameZIndex = parseFloat(
                chart.frameShapes.back.attr('zIndex'),
                10
            );

        assert.strictEqual(
            plotBandZIndex > backFrameZIndex &&
                !isNaN(plotBandZIndex) &&
                !isNaN(backFrameZIndex),
            true,
            'Proper zIndexes'
        );
    }
);
