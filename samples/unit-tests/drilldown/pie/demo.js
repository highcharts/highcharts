QUnit.test('Pie color and data labels', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'pie',
            animation: {
                duration: 1
            }
        },
        title: {
            text: 'Browser market shares. January, 2015 to May, 2015'
        },
        subtitle: {
            text:
                'Click the slices to view versions. Source: netmarketshare.com.'
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    format: '{point.name}: {point.y:.1f}%'
                }
            }
        },
        tooltip: {
            headerFormat:
                '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat:
                '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
        },
        series: [
            {
                showInLegend: true,
                name: 'Brands',
                colorByPoint: true,
                id: 'brands',
                data: [
                    {
                        name: 'Microsoft Internet Explorer',
                        y: 55.33,
                        drilldown: 'Microsoft Internet Explorer'
                    },
                    {
                        name: 'Chrome',
                        y: 24.03,
                        drilldown: 'Chrome'
                    },
                    {
                        name: 'Firefox',
                        y: 10.38,
                        drilldown: 'Firefox'
                    },
                    {
                        name: 'Safari',
                        y: 4.77,
                        drilldown: 'Safari'
                    },
                    {
                        name: 'Opera',
                        y: 0.91,
                        drilldown: 'Opera'
                    },
                    {
                        name: 'Proprietary or Undetectable',
                        y: 0.2,
                        drilldown: null
                    },
                    {
                        name: 'A',
                        y: 0.2,
                        drilldown: 'A'
                    },
                    {
                        name: 'B',
                        y: 0.2,
                        drilldown: 'B'
                    },
                    {
                        name: 'C',
                        y: 0.2,
                        drilldown: 'C'
                    },
                    {
                        name: 'D',
                        y: 0.2,
                        drilldown: 'D'
                    },
                    {
                        name: 'E',
                        y: 0.2,
                        drilldown: 'E'
                    },
                    {
                        name: 'F',
                        y: 0.2,
                        drilldown: 'F'
                    },
                    {
                        name: 'G',
                        y: 0.2,
                        drilldown: 'G'
                    },
                    {
                        name: 'H',
                        y: 0.2,
                        drilldown: 'H'
                    },
                    {
                        name: 'I',
                        y: 0.2,
                        drilldown: 'I'
                    },
                    {
                        name: 'J',
                        y: 0.2,
                        drilldown: 'J'
                    }
                ]
            }
        ],
        drilldown: {
            animation: {
                duration: 1
            },
            series: [
                {
                    showInLegend: true,
                    name: 'Microsoft Internet Explorer',
                    id: 'Microsoft Internet Explorer',
                    data: [
                        ['v11.0', 24.13],
                        ['v8.0', 17.2],
                        ['v9.0', 8.11],
                        ['v10.0', 5.33],
                        ['v6.0', 1.06],
                        ['v7.0', 0.5]
                    ]
                },
                {
                    name: 'Chrome',
                    id: 'Chrome',
                    data: [
                        ['v40.0', 5],
                        ['v41.0', 4.32],
                        ['v42.0', 3.68],
                        ['v39.0', 2.96],
                        ['v36.0', 2.53],
                        ['v43.0', 1.45],
                        ['v31.0', 1.24],
                        ['v35.0', 0.85],
                        ['v38.0', 0.6],
                        ['v32.0', 0.55],
                        ['v37.0', 0.38],
                        ['v33.0', 0.19],
                        ['v34.0', 0.14],
                        ['v30.0', 0.14]
                    ]
                },
                {
                    name: 'Firefox',
                    id: 'Firefox',
                    data: [
                        ['v35', 2.76],
                        ['v36', 2.32],
                        ['v37', 2.31],
                        ['v34', 1.27],
                        ['v38', 1.02],
                        ['v31', 0.33],
                        ['v33', 0.22],
                        ['v32', 0.15]
                    ]
                },
                {
                    name: 'Safari',
                    id: 'Safari',
                    data: [
                        ['v8.0', 2.56],
                        ['v7.1', 0.77],
                        ['v5.1', 0.42],
                        ['v5.0', 0.3],
                        ['v6.1', 0.29],
                        ['v7.0', 0.26],
                        ['v6.2', 0.17]
                    ]
                },
                {
                    name: 'Opera',
                    id: 'Opera',
                    data: [
                        ['v12.x', 0.34],
                        ['v28', 0.24],
                        ['v27', 0.17],
                        ['v29', 0.16]
                    ]
                }
            ]
        }
    });

    assert.equal(chart.series.length, 1, 'Chart created');

    function getVisibilities() {
        return chart.get('brands').points.map(function (point) {
            return point.dataLabel.element.getAttribute('visibility');
        });
    }

    var clock = TestUtilities.lolexInstall(chart);

    try {
        var done = assert.async(),
            visibilities = getVisibilities();

        chart.series[0].points[0].doDrilldown();

        setTimeout(function () {
            assert.equal(
                chart.series[0].name,
                'Microsoft Internet Explorer',
                'Second level name'
            );

            assert.strictEqual(
                chart.legend.contentGroup.element.children[0].children.length,
                6,
                'The number of the legend items should be adapted to the current drilldown level.'
            );

            assert.strictEqual(
                Highcharts.color(
                    chart.series[0].points[3].graphic.element.getAttribute(
                        'fill'
                    )
                ).get(),
                Highcharts.color(Highcharts.getOptions().colors[3]).get(),
                'Point color should be animated'
            );

            chart.drillUp();

            assert.equal(chart.series[0].name, 'Brands', 'First level name');
        }, 50);

        setTimeout(function () {
            var newVisibilities = getVisibilities();

            assert.deepEqual(
                newVisibilities,
                visibilities,
                'The visible state of the data labels should be the same'
            );

            done();
        }, 100);

        TestUtilities.lolexRunAndUninstall(clock);
    } finally {
        TestUtilities.lolexUninstall(clock);
    }
});
QUnit.test('Slice color after drilldown and select (#4359)', function (assert) {
    var options = {
            chart: {
                type: 'pie',
                options3d: {
                    alpha: 45,
                    beta: 0
                }
            },
            plotOptions: {
                pie: {
                    depth: 35,
                    allowPointSelect: true,
                    colors: ['#00e500', '#004400'],
                    ignoreHiddenPoint: false
                }
            },
            series: [
                {
                    name: 'Materials',
                    data: [
                        {
                            y: 23.73
                        },
                        {
                            y: 73.27,
                            drilldown: 'Recycled Materials'
                        },
                        {
                            y: 3,
                            visible: false
                        }
                    ]
                }
            ],
            drilldown: {
                animation: {
                    duration: Number.MIN_VALUE
                },
                series: [
                    {
                        animation: false,
                        id: 'Recycled Materials',
                        data: [
                            ['Tent Frames and Chairs - 6,400 lbs', 4.35],
                            ['Aluminum Cans - 28,950 lbs', 19.66],
                            ['Plastic PET Bottles - 36,420 lbs', 24.73],
                            ['Glass - 40,950 lbs', 27.8],
                            ['Cardboard - 30,000 lbs', 20.37],
                            ['Solo Cups - 4,556 lbs', 3.09]
                        ]
                    }
                ]
            }
        },
        chart,
        chart3d,
        container1,
        container2;

    container1 = document.createElement('div');
    document.body.appendChild(container1);
    container1.id = 'container1';

    container2 = document.createElement('div');
    document.body.appendChild(container2);
    container2.id = 'container2';

    chart = $('#container1').highcharts(options).highcharts();
    options.chart.options3d.enabled = true;
    chart3d = $('#container2').highcharts(options).highcharts();

    chart.series[0].points[1].firePointEvent('click');
    chart.series[0].points[0].select();

    chart3d.series[0].points[1].doDrilldown();
    chart3d.series[0].points[0].select();

    assert.strictEqual(
        chart.series[0].points[0].graphic.attr('fill'),
        chart.series[0].options.colors[0],
        'Proper select-state color'
    );

    assert.strictEqual(
        chart3d.series[0].points[0].graphic.top.attr('fill'),
        chart3d.series[0].options.colors[0],
        'Proper select-state color'
    );

    chart.drillUp();
    assert.strictEqual(
        chart.series[0].points[2].graphic.visibility,
        'hidden',
        'The invisible slice should still be hidden after drill-up (#18303)'
    );

    chart.destroy();
    chart3d.destroy();

    document.body.removeChild(container1);
    document.body.removeChild(container2);
});

QUnit.test(
    'Pie animation duration should be possible to change (#13674)',
    function (assert) {
        var clock = TestUtilities.lolexInstall();

        try {
            var chart = Highcharts.chart('container', {
                    chart: {
                        type: 'pie',
                        animation: {
                            duration: 1000
                        }
                    },
                    series: [
                        {
                            name: 'Things',
                            data: [
                                {
                                    name: 'Animals',
                                    y: 5,
                                    drilldown: 'animals'
                                },
                                {
                                    name: 'Fruits',
                                    y: 2,
                                    drilldown: 'fruits'
                                }
                            ]
                        }
                    ],
                    drilldown: {
                        animation: {
                            duration: 1000
                        },
                        series: [
                            {
                                id: 'animals',
                                data: [
                                    ['Cats', 4],
                                    ['Dogs', 2],
                                    ['Cows', 1],
                                    ['Sheep', 2],
                                    ['Pigs', 1]
                                ]
                            },
                            {
                                id: 'fruits',
                                data: [
                                    ['Apples', 4],
                                    ['Oranges', 2]
                                ]
                            }
                        ]
                    }
                }),
                point = chart.series[0].points[0],
                initialPos,
                previousPos,
                previousColor,
                done = assert.async();

            point.doDrilldown();
            initialPos = chart.drilldownLevels[0].lowerSeries.data[4].graphic
                .attr('start');
            previousColor = chart.options.colors[0];

            assert.strictEqual(
                chart.drilldownLevels[0].lowerSeries.data[0].color,
                chart.options.colors[0],
                'Color of the first slice is correct'
            );

            assert.strictEqual(
                chart.drilldownLevels[0].lowerSeries.data[3].color,
                chart.options.colors[3],
                'Color of the fourth slice is correct'
            );

            const tweeningGraphic =
                chart.drilldownLevels[0].lowerSeries.data[3].graphic;

            setTimeout(function () {
                assert.ok(
                    chart.drilldownLevels[0].lowerSeries.data[4].graphic.attr(
                        'start'
                    ) > initialPos,
                    'Time 400 - Point should start moving.'
                );

                assert.notEqual(
                    tweeningGraphic.attr('fill'),
                    previousColor,
                    'Time 400 - Fill color should be tweening'
                );

                previousPos = chart.drilldownLevels[0].lowerSeries.data[4]
                    .graphic.attr('start');
                previousColor = tweeningGraphic.attr('fill');
            }, 400);

            setTimeout(function () {
                assert.ok(
                    chart.drilldownLevels[0].lowerSeries.data[4].graphic.attr(
                        'start'
                    ) > previousPos,
                    'Time 800 - Point should move.'
                );

                assert.notEqual(
                    tweeningGraphic.attr('fill'),
                    previousColor,
                    'Time 800 - Fill color should be tweening'
                );

                previousPos = chart.drilldownLevels[0].lowerSeries.data[4]
                    .graphic.attr('start');
                previousColor = tweeningGraphic.attr('fill');
            }, 800);

            setTimeout(function () {
                assert.ok(
                    chart.drilldownLevels[0].lowerSeries.data[4].graphic.attr(
                        'start'
                    ) > previousPos,
                    'Time 1200- Point should move.'
                );

                assert.notEqual(
                    tweeningGraphic.attr('fill'),
                    previousColor,
                    'Time 1200 - Fill color should be tweening'
                );

                previousPos = chart.drilldownLevels[0].lowerSeries.data[4]
                    .graphic.attr('start');
                previousColor = tweeningGraphic.attr('fill');
            }, 1200);

            setTimeout(function () {
                assert.strictEqual(
                    chart.drilldownLevels[0].lowerSeries.data[4].graphic.attr(
                        'start'
                    ),
                    previousPos,
                    'Time 1500 - Point should stop.'
                );

                assert.strictEqual(
                    tweeningGraphic.attr('fill'),
                    previousColor,
                    'Time 1500 - Fill color should be finished tweening'
                );

                assert.strictEqual(
                    Highcharts.color(tweeningGraphic.attr('fill')).get(),
                    Highcharts.color(chart.options.colors[3]).get(),
                    'Time 1500 - Fill color should match options after finished tweening'
                );
                done();
            }, 1500);

            TestUtilities.lolexRunAndUninstall(clock);
        } finally {
            TestUtilities.lolexUninstall(clock);
        }
    }
);
