QUnit.test('3d pie with zeroes (#4584)', function (assert) {
    var chart = $('#container')
        .highcharts(
            {
                accessibility: {
                    enabled: false // A11y forces graphic for null points
                },
                chart: {
                    options3d: {
                        enabled: true,
                        alpha: 45
                    }
                },
                series: [
                    {
                        type: 'pie',
                        depth: 50,
                        borderColor: 'green',
                        data: [null, 1]
                    }
                ]
            },
            function () {
                this.series[0].addPoint({ y: 2 });
            }
        )
        .highcharts();

    assert.strictEqual(
        chart.series[0].points.length,
        3,
        'Rendered succesfully'
    );
    assert.strictEqual(
        chart.series[0].points[0].graphic instanceof Highcharts.SVGElement,
        false,
        'Null point does not have graphic'
    );
    assert.strictEqual(
        chart.series[0].points[0].dataLabel instanceof Highcharts.SVGElement,
        false,
        'Null point does not have data label'
    );
    assert.strictEqual(
        chart.series[0].points[1].graphic instanceof Highcharts.SVGElement,
        true,
        'Not null point has graphic'
    );
    assert.strictEqual(
        chart.series[0].points[1].dataLabel instanceof Highcharts.SVGElement,
        true,
        'Not null point has data label'
    );
    assert.strictEqual(
        chart.series[0].points[1].dataLabel.connector instanceof
            Highcharts.SVGElement,
        true,
        'Not null point has connector'
    );

});

QUnit.test(
    'Pie points\' graphic should have visibility=hidden when slices are hidden (#4891)',
    function (assert) {
        var chart = $('#container')
                .highcharts({
                    chart: {
                        type: 'pie',
                        options3d: {
                            enabled: true,
                            alpha: 45,
                            beta: 0
                        }
                    },
                    plotOptions: {
                        pie: {
                            depth: 25
                        }
                    },
                    series: [
                        {
                            data: [2, 4]
                        }
                    ]
                })
                .highcharts(),
            points = chart.series[0].points;

        $.each(points, function (i, p) {
            p.setVisible(false);
        });

        assert.strictEqual(
            points[0].graphic.top.attr('visibility'),
            'hidden',
            'Hidden first slice.'
        );

        assert.strictEqual(
            points[1].graphic.top.attr('visibility'),
            'hidden',
            'Hidden second slice.'
        );
    }
);
QUnit.test(
    'Parts of 3d pie should have correct zIndexes.(#3323)',
    function (assert) {
        $('#container').highcharts({
            chart: {
                type: 'pie',
                options3d: {
                    enabled: true,
                    alpha: 0,
                    beta: -60
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    slicedOffset: 42,
                    dataLabels: {
                        enabled: false
                    }
                }
            },
            series: [
                {
                    depth: 200,
                    data: [
                        {
                            y: 1,
                            sliced: true
                        },
                        3,
                        8,
                        2,
                        1
                    ]
                }
            ]
        });

        var chart = $('#container').highcharts(),
            points = chart.series[0].points;

        assert.strictEqual(
            points[1].graphic.side2.zIndex < points[3].graphic.out.zIndex,
            true,
            'Correct sequence of pie\'s parts - 1/2'
        );

        assert.strictEqual(
            points[0].graphic.side2.zIndex < points[4].graphic.out.zIndex,
            true,
            'Correct sequence of pie\'s parts - 2/2'
        );
    }
);

QUnit.test('All faces should have class name', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 45,
                beta: 0
            }
        },
        xAxis: {
            categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec'
            ]
        },

        plotOptions: {
            series: {
                borderRadius: 5,
                depth: 35
            }
        },

        series: [
            {
                data: [
                    29.9,
                    71.5,
                    106.4,
                    129.2,
                    144.0,
                    176.0,
                    135.6,
                    148.5,
                    216.4,
                    194.1,
                    95.6,
                    54.4
                ]
            }
        ]
    });

    assert.strictEqual(
        chart.series[0].points[0].graphic.side1.hasClass('highcharts-color-0'),
        true,
        'Color class applied'
    );
});

QUnit.test('3d pie drilldown and drill up', function (assert) {
    var done = assert.async();

    var clock = TestUtilities.lolexInstall();

    // Create the chart
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 40,
                beta: 12,
                depth: 40
            }
        },
        series: [
            {
                name: 'Brands',
                colorByPoint: true,
                data: [
                    {
                        name: 'IE',
                        y: 56.33,
                        drilldown: 'IE'
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
                    }
                ]
            }
        ],
        drilldown: {
            series: [
                {
                    name: 'IE',
                    id: 'IE',
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

    chart.series[0].points[1].doDrilldown();

    setTimeout(function () {
        assert.strictEqual(
            chart.series[0].name,
            'Chrome',
            'Successfully drilled down'
        );

        chart.drillUp();
    }, 500);

    setTimeout(function () {
        assert.strictEqual(
            chart.series[0].name,
            'Brands',
            'Successfully drilled up'
        );
        done();
    }, 1000);

    TestUtilities.lolexRunAndUninstall(clock);
});

QUnit.test('3D pie updates', assert => {
    // Create the chart
    const chart = Highcharts.chart('container', {
            chart: {
                type: 'pie',
                options3d: {
                    enabled: true,
                    alpha: 45,
                    beta: 0
                }
            },
            plotOptions: {
                series: {
                    animation: true
                },
                pie: {
                    depth: 35
                }
            },
            series: [
                {
                    data: [5]
                }
            ]
        }),
        point = chart.series[0].points[0],
        // use point.graphic.out to get outer part of the 3D arc
        height = point.graphic.out.getBBox(true).height;

    chart.series[0].update({
        depth: 50
    });

    assert.ok(
        height < point.graphic.out.getBBox(true).height,
        'Updating series.depth should change slice\'s depth (#12515).'
    );

    assert.strictEqual(
        chart.series[0].group.oldtranslateX,
        chart.plotLeft,
        'Updating series shouldn\'t change pie x position (#11928).'
    );

    assert.strictEqual(
        chart.series[0].group.oldtranslateY,
        chart.plotTop,
        'Updating series shouldn\'t change pie y position (#11928).'
    );
});

QUnit.test('#13804: Inactive tab animation threw', assert => {
    const animate = Highcharts.SVGElement.prototype.animate;
    Highcharts.SVGElement.prototype.animate = function (params, options) {
        // Simulate inactive tab
        if (options) {
            options.duration = 0;
        } else {
            options = { duration: 0 };
        }

        animate.call(this, params, options);
    };

    const chart = Highcharts.chart('container', {
        chart: {
            animation: {
                duration: 500
            },
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 45,
                beta: 0
            }
        },
        plotOptions: {
            pie: {
                depth: 35
            }
        },
        series: [{
            type: 'pie',
            data: [
                Math.random() * 20,
                Math.random() * 20,
                Math.random() * 20,
                Math.random() * 20
            ]
        }]
    });

    chart.update({
        series: [{
            data: [
                Math.random() * 20,
                Math.random() * 20,
                Math.random() * 20,
                Math.random() * 20
            ]
        }]
    });

    assert.ok(true, 'It should not throw');

    Highcharts.SVGElement.prototype.animate = animate;
});

QUnit.test('Pie 3d interations (clicks, hovers etc.)', assert => {
    let clicks = 0;

    const chart = new Highcharts.Chart('container', {
            chart: {
                type: 'pie',
                options3d: {
                    enabled: true,
                    alpha: 90
                }
            },
            plotOptions: {
                pie: {
                    cursor: 'pointer',
                    depth: 35,
                    events: {
                        click: () => clicks++
                    }
                }
            },
            series: [{
                type: 'pie',
                data: [5, 2, 3]
            }]
        }),
        controller = new TestController(chart);

    controller.moveTo(
        chart.plotLeft + chart.series[0].center[0] - 20,
        chart.plotTop + chart.series[0].center[1] + 5
    );

    controller.click(
        chart.plotLeft + chart.series[0].center[0] - 20,
        chart.plotTop + chart.series[0].center[1] + 5
    );

    assert.strictEqual(
        clicks,
        1,
        'Clicking on a side of a 3d slice should fire click event (#16474).'
    );
});