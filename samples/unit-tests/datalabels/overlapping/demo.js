QUnit.test(
    'Overlapping dataLabels should be hidden',
    function (assert) {
        var chart = Highcharts.chart('container', {
                plotOptions: {
                    series: {
                        dataLabels: {
                            enabled: true,
                            rotation: 270
                        }
                    }
                },
                series: [{
                    data: [
                    [0, 1],
                    [1, 1],
                    [2, 0]
                    ]
                }, {
                    data: [
                    [0, 1],
                    [1, 2],
                    [2, 0.5]
                    ]
                }]
            }),
            series = chart.series;

        assert.strictEqual(
            (
                chart.series[0].points[0].dataLabel.opacity === 1 &&
                series[0].points[0].dataLabel.element
                    .getAttribute('visibility') !== 'hidden'
            ),
            true,
            'Rotated dataLabel visible (#7362).'
        );

        assert.strictEqual(
            (
                chart.series[1].points[0].dataLabel.opacity === 0 ||
                series[1].points[0].dataLabel.element
                    .getAttribute('visibility') === 'hidden'
            ),
            true,
            'Rotated dataLabel hidden (#7362).'
        );
    }
);

QUnit.test(
    'After zooming, dataLabels from hidden points should remain hidden.',
    function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                type: 'heatmap',
                width: 200,
                height: 400,
                zoomType: 'xy'
            },
            colorAxis: {
                dataClasses: [{
                    to: 100
                }, {
                    from: 100,
                    to: 5000
                }]
            },
            series: [{
                data: [
                    [0, 0, 67],
                    [0, 1, 2222],
                    [1, 0, 48],
                    [1, 1, 1117]
                ],
                dataLabels: {
                    enabled: true,
                    style: {
                        fontSize: "26px"
                    }
                }
            }]
        });

        chart.legend.allItems[1].legendGroup.element.onclick();
        chart.xAxis[0].setExtremes(0.5);

        assert.strictEqual(
            chart.series[0].points[3].dataLabel.visibility === 'hidden',
            true,
            'The dataLabel after zoom is hidden (#7815).'
        );
    }
);
