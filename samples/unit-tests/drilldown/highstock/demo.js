QUnit.test('Drilldown with Highcharts Stock (#5764)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'pie'
        },

        series: [
            {
                data: [
                    {
                        name: 'Cats',
                        y: 3
                    },
                    {
                        name: 'Dogs',
                        y: 2
                    },
                    {
                        name: 'Cars',
                        y: 4,
                        drilldown: 'cars'
                    }
                ],
                animation: false,
                name: 'Upper'
            }
        ],
        drilldown: {
            series: [
                {
                    id: 'cars',
                    data: [
                        {
                            name: 'Electric',
                            y: 3
                        },
                        {
                            name: 'ICE',
                            y: 4
                        }
                    ],
                    name: 'Cars'
                }
            ]
        }
    });

    assert.strictEqual(chart.series[0].name, 'Upper', 'Ready');

    chart.series[0].points[2].doDrilldown();
    assert.strictEqual(chart.series[0].name, 'Cars', 'Drilled');
});

QUnit.test(
    'Drilldown with Highcharts Stock + Scrollbar (#22052)',
    function (assert) {
        var data = [];
        var drilldownData = [];
        for (var i = 0; i < 100; i++) {
            data.push({
                name: i.toString(),
                y: i,
                drilldown: i.toString()
            });
            drilldownData.push({
                id: i.toString(),
                data: [
                    [i, i]
                ]
            });
        }

        const chart = Highcharts.chart('container', {
            chart: {
                type: 'column',
                animation: false
            },
            xAxis: {
                type: 'category',
                min: 0,
                max: 20,
                scrollbar: {
                    enabled: true
                }
            },

            legend: {
                enabled: false
            },

            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true
                    },
                    animation: false
                }
            },

            series: [{
                name: 'Things',
                colorByPoint: true,
                data
            }],
            drilldown: {
                series: drilldownData,
                animation: false
            }
        },
        chart => {
            // Scroll to the side
            chart.xAxis[0].setExtremes(79, 99);
        });

        chart.series[0].data.find(p => p && p.name === '88').doDrilldown();

        const breadcrumbs = chart.breadcrumbs.elementList;
        const lastBreadcrumb = breadcrumbs[
            Object.keys(breadcrumbs).length - 1
        ];
        const breadcrumbText = lastBreadcrumb.button.text.textStr;

        assert.strictEqual(
            breadcrumbText,
            '88',
            'Breadcrumbs should show correct point after drilldown with ' +
            'scrolling'
        );
    });
