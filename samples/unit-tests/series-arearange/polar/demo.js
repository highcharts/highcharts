QUnit.test(
    '(#13789) Arearange on polar with connectEnds set to false.',
    function (assert) {
        var chart = Highcharts.chart('container', {
                chart: {
                    polar: true,
                    type: 'arearange'
                },
                pane: {
                    size: '100%'
                },
                series: [
                    {
                        connectEnds: false,
                        lineWidth: 2,
                        lineColor: '#000',
                        data: [
                            [0, 20, 70],
                            [1, 70, 120],
                            [2, -20, 320]
                        ]
                    }
                ]
            }),
            areaPath = chart.series[0].areaPath;

        assert.ok(
            areaPath[0][1] === areaPath[7][1] &&
                areaPath[0][2] === areaPath[7][2],
            'The arearange is correcty closed at the start.'
        );

        assert.ok(
            areaPath[2][1] === areaPath[3][1] &&
                areaPath[2][2] === areaPath[3][2],
            'The arearange is correcty closed at the end.'
        );
    }
);
