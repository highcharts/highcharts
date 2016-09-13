jQuery(function () {
    QUnit.test('Colors are the same regardless of legend visibility', function (assert) {
        var chartOptions = {
                chart: {
                    type: 'heatmap'
                },

                colorAxis: {
                    stops: [
                        [0, '#8b0000'],
                        [0.5, '#ffffff'],
                        [1, '#00008b']
                    ]
                },

                series: [{
                    data: [
                        [0, 0, 10],
                        [0, 1, 19],
                        [0, 2, 8],
                        [0, 3, 24],
                        [0, 4, 67],
                        [1, 0, 92],
                        [1, 1, 58],
                        [1, 2, 78],
                        [1, 3, 117],
                        [1, 4, 48],
                        [2, 0, 35],
                        [2, 1, 15],
                        [2, 2, 123]
                    ]
                }]
            },
            chart = Highcharts.chart('container', Highcharts.merge(chartOptions, {
                legend: {
                    enabled: true
                }
            })),
            color = chart.series[0].points[0].color;
        chart = Highcharts.chart('container', Highcharts.merge(chartOptions, {
            legend: {
                enabled: false
            }
        }));

        assert.strictEqual(color, chart.series[0].points[0].color, 'Color is the same');
    });
});
