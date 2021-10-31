QUnit.test('Waterfall stacking', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'waterfall'
        },
        yAxis: {
            reversed: true
        },
        plotOptions: {
            series: {
                stacking: 'normal',
                lineWidth: 1
            }
        },
        series: [
            {
                data: [
                    10,
                    10,
                    30,
                    {
                        isIntermediateSum: true
                    },
                    20,
                    {
                        isIntermediateSum: true
                    },
                    10,
                    {
                        isSum: true
                    }
                ]
            },
            {
                data: [
                    -20,
                    -10,
                    -20,
                    {
                        isIntermediateSum: true
                    },
                    10,
                    {
                        isIntermediateSum: true
                    },
                    -20,
                    {
                        isSum: true
                    }
                ]
            },
            {
                data: [
                    -20,
                    10,
                    10,
                    {
                        isIntermediateSum: true
                    },
                    30,
                    {
                        isIntermediateSum: true
                    },
                    -10,
                    {
                        isSum: true
                    }
                ]
            }
        ]
    });

    assert.notStrictEqual(
        chart.series[0].points[0].graphic,
        void 0,
        '#6020: First points correctly rendered.'
    );

    const paths = chart.series.map((s) => JSON.stringify(s.getCrispPath()));
    assert.ok(
        paths.every((p) => p === paths[0]),
        '#14148: All series should draw the same connector line'
    );
});
