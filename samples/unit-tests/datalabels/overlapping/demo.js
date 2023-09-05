QUnit.test('Overlapping dataLabels should be hidden', function (assert) {
    var chart = Highcharts.chart('container', {
            plotOptions: {
                series: {
                    dataLabels: {
                        crop: false,
                        enabled: true,
                        rotation: 270
                    }
                }
            },
            series: [
                {
                    data: [
                        [0, 1],
                        [1, 1],
                        [2, 0]
                    ]
                },
                {
                    data: [
                        [0, 1],
                        [1, 2],
                        [2, 0.5]
                    ]
                }
            ]
        }),
        series = chart.series;

    assert.strictEqual(
        chart.series[0].points[0].dataLabel.opacity === 1 &&
            series[0].points[0].dataLabel.element.getAttribute('visibility') !==
                'hidden',
        true,
        'Rotated dataLabel visible (#7362).'
    );

    assert.strictEqual(
        chart.series[1].points[0].dataLabel.opacity === 0 ||
            series[1].points[0].dataLabel.element.getAttribute('visibility') ===
                'hidden',
        true,
        'Rotated dataLabel hidden (#7362).'
    );

    chart.update({
        plotOptions: {
            series: {
                dataLabels: {
                    allowOverlap: true
                }
            }
        }
    });

    assert.ok(
        chart.series[1].points[0].dataLabel.opacity === 1 &&
            series[1].points[0].dataLabel.element.getAttribute('visibility') !==
                'hidden',
        '#13449: dataLabel should be visible after updating allowOverlap'
    );

    chart.update({
        chart: {
            type: 'column'
        },
        plotOptions: {
            column: {
                grouping: false,
                dataLabels: {
                    useHTML: true,
                    allowOverlap: false,
                    rotation: 0
                }
            }
        },
        series: [{
            data: [2]
        }, {
            data: [1.999]
        }]
    });

    assert.strictEqual(
        chart.series[1].points[0].dataLabel.div.style['pointer-events'],
        'none',
        'Pointer events for overlapped labels should be disabled (#18821)'
    );
});

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
                dataClasses: [
                    {
                        to: 100
                    },
                    {
                        from: 100,
                        to: 5000
                    }
                ]
            },
            series: [
                {
                    data: [
                        [0, 0, 67],
                        [0, 1, 2222],
                        [1, 0, 48],
                        [1, 1, 1117]
                    ],
                    dataLabels: {
                        enabled: true,
                        style: {
                            fontSize: '26px'
                        }
                    }
                }
            ]
        });

        Highcharts.fireEvent(chart.legend.allItems[1].legendItem.group.element, 'click');
        chart.xAxis[0].setExtremes(0.5);

        assert.ok(
            !chart.series[0].points[3].dataLabel ||
                chart.series[0].points[3].dataLabel.visibility === 'hidden',
            'The dataLabel should be hidden after zoom (#7815).'
        );
    }
);

QUnit.test('Overlapping labels with paddings', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'bar',
            width: 530
        },
        yAxis: {
            min: -10,
            stackLabels: {
                enabled: true
            }
        },
        plotOptions: {
            series: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true
                }
            }
        },
        series: [
            {
                name: 'John',
                data: [2.89765436543]
            },
            {
                name: 'Jane',
                data: [1.89765436543]
            },
            {
                name: 'Joe',
                data: [5.89765436543]
            }
        ]
    });

    assert.ok(
        chart.series[0].points[0].dataLabel.attr('y') < 0 ||
            chart.series[0].points[0].dataLabel.attr('opacity') === 0,
        'Overlapping dataLabel is hidden (#9119).'
    );
});
