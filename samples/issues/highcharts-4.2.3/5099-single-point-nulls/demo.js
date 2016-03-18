jQuery(function () {

    QUnit.test('Single point marker surrounded by null', function (assert) {

        var chart = Highcharts.chart('container', {
            chart: {
                type: 'area'
            },
            xAxis: {
                type: "category",
                tickmarkPlacement: 'on',
                tickInterval: 1,
                tickColor: '#2E2F35',
                lineColor: '#2E2F35',
                labels: {
                    style: {
                        color: '#7d7e7c',
                        fontSize: '9px'
                    },
                    y: 30
                }
            },
            yAxis: {
                min: 0,
                gridLineColor: '#2E2F35',
                zIndex: '1',
                title: {
                    text: ''
                },
                labels: {
                    style: {
                        color: '#7d7e7c',
                        fontSize: '9px'
                    }
                }
            },
            tooltip: {
                pointFormat: '{series.name} produced <b>{point.y:,.0f}</b><br/>warheads in {point.x}'
            },
            plotOptions: {
                spline: {
                    marker: {
                        radius: 4,
                        lineColor: '#666666',
                        lineWidth: 0.5
                    }
                }
            },
            series: [{
                "color": "#F94DA7",
                "connectNulls": "true",
                "borderColor": "#F94DA7",
                "marker": {
                    "symbol": "circle"
                },
                "name": "Actual",
                "data": [
                    [
                        "T-45",
                        null
                    ],
                    [
                        "T-44",
                        null
                    ],
                    [
                        "T-43",
                        null
                    ],
                    [
                        "T-42",
                        null
                    ],
                    [
                        "T-41",
                        null
                    ],
                    [
                        "T-40",
                        null
                    ],
                    [
                        "T-39",
                        null
                    ],
                    [
                        "T-38",
                        null
                    ],
                    [
                        "T-37",
                        null
                    ],
                    [
                        "T-36",
                        null
                    ],
                    [
                        "T-35",
                        null
                    ],
                    [
                        "T-34",
                        null
                    ],
                    [
                        "T-33",
                        null
                    ],
                    [
                        "T-32",
                        null
                    ],
                    [
                        "T-31",
                        null
                    ],
                    [
                        "T-30",
                        null
                    ],
                    [
                        "T-29",
                        null
                    ],
                    [
                        "T-28",
                        null
                    ],
                    [
                        "T-27",
                        null
                    ],
                    [
                        "T-26",
                        null
                    ],
                    [
                        "T-25",
                        null
                    ],
                    [
                        "T-24",
                        null
                    ],
                    [
                        "T-23",
                        null
                    ],
                    [
                        "T-22",
                        null
                    ],
                    [
                        "T-21",
                        null
                    ],
                    [
                        "T-20",
                        null
                    ],
                    [
                        "T-19",
                        null
                    ],
                    [
                        "T-18",
                        null
                    ],
                    [
                        "T-17",
                        null
                    ],
                    [
                        "T-16",
                        null
                    ],
                    [
                        "T-15",
                        null
                    ],
                    [
                        "T-14",
                        null
                    ],
                    [
                        "T-13",
                        null
                    ],
                    [
                        "T-12",
                        null
                    ],
                    [
                        "T-11",
                        null
                    ],
                    [
                        "T-10",
                        null
                    ],
                    [
                        "T-9",
                        null
                    ],
                    [
                        "T-8",
                        null
                    ],
                    [
                        "T-7",
                        null
                    ],
                    [
                        "T-6",
                        null
                    ],
                    [
                        "T-5",
                        null
                    ],
                    [
                        "T-4",
                        null
                    ],
                    [
                        "T-3",
                        null
                    ],
                    [
                        "T-2",
                        null
                    ],
                    [
                        "T-1",
                        null
                    ],
                    [
                        "T-0",
                        null
                    ],
                    [
                        "T+1",
                        null
                    ],
                    [
                        "T+2",
                        null
                    ],
                    [
                        "T+3",
                        null
                    ],
                    [
                        "T+4",
                        null
                    ],
                    [
                        "T+5",
                        null
                    ],
                    [
                        "T+6",
                        null
                    ],
                    [
                        "T+7",
                        3500
                    ],
                    [
                        "T+8",
                        null
                    ],
                    [
                        "T+9",
                        null
                    ],
                    [
                        "T+10",
                        null
                    ],
                    [
                        "T+11",
                        null
                    ],
                    [
                        "T+12",
                        null
                    ],
                    [
                        "T+13",
                        null
                    ]
                ],
                "pointPadding": -0.1
            }]
        });
        assert.strictEqual(
            typeof chart.series[0].points[51].graphic,
            'undefined',
            'Graphic not created'
        );
        assert.strictEqual(
            typeof chart.series[0].points[52].graphic,
            'object',
            'Graphic created'
        );
        assert.strictEqual(
            typeof chart.series[0].points[53].graphic,
            'undefined',
            'Graphic not created'
        );
    });
});