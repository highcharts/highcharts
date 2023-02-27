QUnit.test('Drill up button with responsive rules', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column',
            width: 300
        },
        series: [
            {
                data: [
                    {
                        y: 3,
                        drilldown: '1'
                    }
                ]
            }
        ],
        title: {
            text: null
        },
        responsive: {
            rules: [
                {
                    condition: {
                        maxWidth: 400
                    },
                    chartOptions: {
                        drilldown: {
                            breadcrumbs: {
                                position: {
                                    y: 100
                                }
                            }
                        }
                    }
                }
            ]
        },
        drilldown: {
            drillUpButton: {
                relativeTo: 'chart'
            },
            series: [
                {
                    id: '1',
                    data: [1]
                }
            ]
        }
    });

    chart.series[0].points[0].doDrilldown();

    assert.strictEqual(
        chart.breadcrumbs.group.alignOptions.y,
        100,
        'The button respects responsive rules on chart init.'
    );
});
