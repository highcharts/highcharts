QUnit.test(
    'Adding and removing series, reflect in navigator',
    function (assert) {
        var chart = Highcharts.stockChart('container', {
            plotOptions: {
                series: {
                    showInNavigator: true
                }
            },
            series: [
                {
                    data: [1, 2, 3, 4]
                },
                {
                    data: [5, 5, 4, 5]
                },
                {
                    data: [3, 2, 1, 0]
                }
            ]
        });
        assert.strictEqual(
            chart.navigator.series.length,
            3,
            'Navigator has three series'
        );
        chart.addSeries({
            data: [7, 7, 7, 7]
        });
        assert.strictEqual(
            chart.navigator.series.length,
            4,
            'Navigator has four series'
        );
        chart.series[0].remove();
        assert.strictEqual(
            chart.navigator.series.length,
            3,
            'Navigator has three series'
        );
        chart.series[1].remove();
        assert.strictEqual(
            chart.navigator.series.length,
            2,
            'Navigator has two series'
        );
    }
);

QUnit.test(
    'Adding and removing series, no change to navigator data',
    function (assert) {
        var chart = Highcharts.stockChart('container', {
            navigator: {
                adaptToUpdatedData: false
            },
            plotOptions: {
                series: {
                    showInNavigator: true
                }
            },
            series: [
                {
                    data: [1, 2, 3, 4, 5, 6, 7, 8]
                },
                {
                    data: [5, 5, 4, 5, 6, 7, 8, 9]
                },
                {
                    data: [3, 2, 1, 0, 3, 2, 1, 1]
                }
            ]
        });
        assert.strictEqual(
            chart.navigator.series.length,
            3,
            'Navigator has three series'
        );
        chart.series[0].setData([1, 2, 3]);
        chart.series[1].setData([1, 2, 3]);
        chart.series[2].setData([1, 2, 3]);
        chart.addSeries({
            data: [7, 7, 7, 7]
        });
        assert.strictEqual(
            chart.navigator.series.length,
            4,
            'Navigator has four series'
        );
        assert.strictEqual(
            chart.navigator.series[0].data.length,
            8,
            'First navigator series data has not changed'
        );
        assert.strictEqual(
            chart.navigator.series[1].data.length,
            8,
            'Second navigator series data has not changed'
        );
        assert.strictEqual(
            chart.navigator.series[2].data.length,
            8,
            'Third navigator series data has not changed'
        );
        assert.strictEqual(
            chart.navigator.series[3].data.length,
            4,
            'Fourth navigator series has 4 points'
        );
        chart.series[1].remove();
        assert.strictEqual(
            chart.navigator.series.length,
            3,
            'Navigator has three series left'
        );
    }
);

QUnit.test('Adding and removing points', function (assert) {
    var chart = Highcharts.stockChart('container', {
        plotOptions: {
            series: {
                showInNavigator: true
            }
        },
        series: [
            {
                data: [1, 2, 3, 4]
            },
            {
                data: [5, 5, 4, 5]
            },
            {
                data: [3, 2, 1, 0]
            }
        ]
    });
    assert.strictEqual(
        chart.navigator.series[1].data.length,
        4,
        'Navigator series has 4 points'
    );
    chart.series[1].addPoint(5);
    assert.strictEqual(
        chart.navigator.series[1].data.length,
        5,
        'Navigator series has 5 points'
    );
    chart.series[1].setData([5, 5, 4, 5, 5, 6]);
    assert.strictEqual(
        chart.navigator.series[1].data.length,
        6,
        'Navigator series has 6 points'
    );
    chart.series[1].removePoint(0);
    assert.strictEqual(
        chart.navigator.series[1].data.length,
        5,
        'Navigator series has 5 points'
    );
    chart.series[1].points[3].remove();
    assert.strictEqual(
        chart.navigator.series[1].data.length,
        4,
        'Navigator series has 4 points'
    );
});

QUnit.test('Update options', function (assert) {
    let redrawsAmount = 0;
    const chart = Highcharts.stockChart('container', {
        chart: {
            type: 'line',
            events: {
                redraw() {
                    redrawsAmount++;
                }
            }
        },
        series: [
            {
                data: [1, 2, 3, 4]
            },
            {
                data: [5, 5, 4, 5]
            }
        ]
    });
    assert.strictEqual(
        chart.navigator.series.length,
        1,
        'Navigator has one series'
    );
    assert.strictEqual(
        chart.navigator.series[0],
        chart.series[0].navigatorSeries,
        'Navigator series is first series'
    );
    chart.update({
        xAxis: {
            labels: {
                enabled: false
            }
        },
        navigator: {
            margin: 50,
            baseSeries: 1,
            handles: {
                backgroundColor: '#ff0000',
                height: 30,
                width: 30,
                symbols: ['circle', 'circle']
            }
        }
    });
    assert.strictEqual(
        redrawsAmount,
        1,
        'Updating multiple navigator options should trigger only one redraw.'
    );

    const handle = chart.navigator.handles[0];
    assert.strictEqual(
        handle.attr('d'),
        'M -0.9999999999999991 30 A 15 15 0 1 1 -0.9998 29.999999998666667 Z',
        'Navigator handles should be updated to new symbol path (circle).'
    );
    assert.strictEqual(
        handle.attr('fill'),
        '#ff0000',
        'Navigator handle should have a red color.'

    );
    assert.close(
        handle.getBBox().height,
        30,
        0.5,
        'Navigator handles should be updated to new height.'
    );
    assert.close(
        handle.getBBox().width,
        30,
        0.5,
        'Navigator handles should be updated to new width.'
    );
    assert.strictEqual(
        chart.navigator.series.length,
        1,
        'Navigator has one series'
    );
    assert.strictEqual(
        chart.navigator.series[0],
        chart.series[1].navigatorSeries,
        'Navigator series is second series'
    );
    chart.update({
        plotOptions: {
            series: {
                showInNavigator: false
            }
        }
    });
    assert.strictEqual(
        chart.navigator.series.length,
        0,
        'Navigator has no series'
    );
    chart.series[0].update({
        showInNavigator: true,
        navigatorOptions: {
            color: '#f00'
        }
    });
    assert.strictEqual(
        chart.navigator.series[0].color,
        '#f00',
        'Navigator has one series with changed color'
    );

    chart.update({
        chart: {
            inverted: true
        },
        navigator: {
            height: 100
        }
    });
    assert.strictEqual(
        chart.navigator.navigatorGroup.getBBox().width,
        100,
        'Height of navigator should be correct in inverted charts.'
    );
    assert.strictEqual(
        chart.navigator.shades[1].getBBox().height,
        chart.plotSizeX,
        'Width of navigator should be correct in inverted charts.'
    );
});

QUnit.test('Update navigator series', function (assert) {
    var chart = Highcharts.stockChart('container', {
        navigator: {
            series: {
                data: [2, 3, 2, 3, 2, 3, 2, 3],
                color: '#f00'
            }
        },
        plotOptions: {
            series: {
                showInNavigator: false
            }
        },
        series: [
            {
                data: [1, 2, 5, 4]
            },
            {
                data: [5, 5, 4, 5]
            }
        ]
    });
    assert.strictEqual(
        chart.navigator.series.length,
        1,
        'One navigator series created'
    );
    assert.strictEqual(
        chart.navigator.series[0].data.length,
        8,
        'Navigator series data set'
    );
    assert.strictEqual(
        chart.navigator.series[0].color,
        '#f00',
        'Navigator series is red'
    );
    chart.navigator.series[0].update({
        color: '#0f0'
    });
    assert.strictEqual(
        chart.navigator.series[0].color,
        '#0f0',
        'Navigator series is green'
    );
    chart.series[0].update({
        color: '#0f0'
    });
    assert.strictEqual(chart.series[0].color, '#0f0', 'Series is green');
});

QUnit.test('Update navigator series, not data', function (assert) {
    var chart = Highcharts.stockChart('container', {
        navigator: {
            adaptToUpdatedData: false,
            series: {
                color: '#f00'
            }
        },
        plotOptions: {
            series: {
                showInNavigator: true
            }
        },
        series: [
            {
                data: [1, 2, 5, 4]
            },
            {
                data: [5, 5, 4, 5]
            }
        ]
    });
    assert.strictEqual(
        chart.navigator.series.length,
        2,
        'Two navigator series created'
    );
    assert.strictEqual(
        chart.navigator.series[0].data.length,
        4,
        'Navigator series data set'
    );
    assert.strictEqual(
        chart.navigator.series[1].data.length,
        4,
        'Navigator series data set'
    );
    assert.strictEqual(
        chart.navigator.series[0].color,
        '#f00',
        'Navigator series is red'
    );
    assert.strictEqual(
        chart.navigator.series[1].color,
        '#f00',
        'Navigator series is red'
    );
    chart.series[0].update({
        color: '#0f0'
    });
    assert.strictEqual(
        chart.navigator.series[0].color,
        '#f00',
        'Navigator series is still red'
    );
    chart.navigator.series[0].update({
        color: '#0f0'
    });
    assert.strictEqual(
        chart.navigator.series[0].color,
        '#0f0',
        'Navigator series is green'
    );
});

QUnit.test('Hide navigator series when hiding base', function (assert) {
    var chart = Highcharts.stockChart('container', {
        plotOptions: {
            series: {
                showInNavigator: true
            }
        },
        legend: {
            enabled: true
        },
        series: [
            {
                data: [1, 2, 5, 4]
            },
            {
                data: [5, 5, 4, 5]
            }
        ]
    });
    assert.strictEqual(
        chart.navigator.series.length,
        2,
        'Two navigator series created'
    );
    chart.series[0].hide();
    assert.strictEqual(
        chart.navigator.series[0].visible,
        false,
        'Navigator series hidden'
    );
    assert.strictEqual(
        chart.navigator.series[1].visible,
        true,
        'Other navigator series visible'
    );
    chart.series[1].hide();
    assert.strictEqual(
        chart.navigator.series[1].visible,
        false,
        'Navigator series hidden'
    );
    chart.series[1].show();
    assert.strictEqual(
        chart.navigator.series[1].visible,
        true,
        'Navigator series shown again'
    );
    chart.series[0].show();
    assert.strictEqual(
        chart.navigator.series[0].visible,
        true,
        'Navigator series shown again'
    );
});

QUnit.test(
    'Resize chart with responsive rules requiring Series.update (#7109)',
    function (assert) {
        var chart = Highcharts.stockChart('container', {
            chart: {
                width: 500
            },
            series: [
                {
                    name: 'USD to EUR',
                    data: [1, 3, 2, 4, 3, 5]
                }
            ],
            responsive: {
                rules: [
                    {
                        condition: {
                            maxWidth: 600
                        },
                        chartOptions: {
                            chart: {
                                type: 'area'
                            }
                        }
                    }
                ]
            }
        });

        assert.strictEqual(
            chart.series[0].type,
            'area',
            'Initial chart type from responsive rule'
        );

        chart.setSize(700);
        assert.strictEqual(
            chart.series[0].type,
            'line',
            'New chart type, responsive rule no longer applies'
        );
    }
);
