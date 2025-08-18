QUnit.test('Guard too dense minor grid lines', function (assert) {
    Highcharts.setOptions({
        yAxis: {
            minorTickInterval: 'auto' // This is not working
        }
    });

    Highcharts.stockChart('container', {
        yAxis: {
            minorTickInterval: 'auto' // This is working
        },
        series: [
            {
                data: [
                    [1426723200000, 22.999999999999996],
                    [1457568000000, 23]
                ]
            }
        ]
    });

    // Reset
    delete Highcharts.defaultOptions.yAxis.minorTickInterval;

    const chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        xAxis: {
            type: 'category',
            gridLineWidth: 1,
            tickWidth: 1
        },

        series: [{
            pointPlacement: 'between',
            data: [
                5,
                2,
                4, 3, 2, 1, 4, 3
            ]
        }]
    });

    assert.strictEqual(
        chart.xAxis[0].ticks[-1].mark.attr('opacity'),
        0,
        'Tick mark outside axis shouldn\'t be visible (#20166).'
    );

    assert.strictEqual(
        chart.xAxis[0].ticks[-1].gridLine.attr('opacity'),
        0,
        'Grid line outside axis shouldn\'t be visible (#20166).'
    );
});

QUnit.test('Animation of grid lines and tick marks', function (assert) {
    var clock = TestUtilities.lolexInstall();
    var chart = Highcharts.stockChart('container', {
        chart: {
            animation: {
                duration: 500,
                easing: function (t) {
                    return t; // linear easing
                }
            }
        },
        xAxis: {
            gridLineWidth: 1
        },
        series: [
            {
                data: [
                    [0, 1],
                    [1, 1],
                    [2, 2],
                    [3, 1]
                ]
            }
        ]
    });

    var oldPos1 = chart.xAxis[0].toPixels(1),
        oldPos5 = chart.xAxis[0].toPixels(5);

    chart.series[0].setData([
        [3, 1],
        [4, 1],
        [5, 2],
        [6, 1]
    ]);

    var newPos1 = chart.xAxis[0].toPixels(1),
        halfwayPos1 = (newPos1 + oldPos1) / 2,
        newPos5 = chart.xAxis[0].toPixels(5),
        halfwayPos5 = (newPos5 + oldPos5) / 2;
    clock.tick(250);

    assert.close(
        chart.xAxis[0].ticks[1].gridLine.attr('d').split(' ')[1],
        halfwayPos1,
        15,
        'Half way in the animation, the dying line should be half way ' +
            'between old and new position'
    );
    assert.close(
        chart.xAxis[0].ticks[1].mark.attr('d').split(' ')[1],
        chart.xAxis[0].ticks[1].gridLine.attr('d').split(' ')[1],
        1,
        'The dying tick and the grid line should be aligned'
    );

    assert.close(
        chart.xAxis[0].ticks[5].gridLine.attr('d').split(' ')[1],
        halfwayPos5,
        15,
        'Half way in the animation, the new line should be half way ' +
            'between old and new position'
    );
    assert.close(
        chart.xAxis[0].ticks[5].mark.attr('d').split(' ')[1],
        chart.xAxis[0].ticks[5].gridLine.attr('d').split(' ')[1],
        1,
        'The new tick and the grid line should be aligned'
    );

    TestUtilities.lolexUninstall(clock);
});


QUnit.test('Position of grid lines and tick marks (#22981)', function (assert) {
    const chart = Highcharts.chart('container', {
        yAxis: [{
            tickWidth: 1,
            gridLineColor: 'red',
            tickAmount: 4
        }],
        series: [{
            data: [1, 2, 3, 4, 5]
        }]
    });
    const ticks = chart.yAxis[0].ticks;

    for (const pos in ticks) {
        if (Object.hasOwnProperty.call(ticks, pos)) {
            assert.strictEqual(
                ticks[pos].mark.attr('d').split(' ')[2],
                ticks[pos].gridLine.attr('d').split(' ')[2],
                `Tick ${pos} mark and grid line should have the same y
                position.`
            );
        }
    }
});

QUnit.test('Grid line gaps across panes (#23382)', function (assert) {
    const chart = Highcharts.stockChart('container', {
        plotOptions: {
            series: {
                pointStart: '2025-07-30',
                pointIntervalUnit: 'day'
            }
        },
        series: [{
            data: [1, 3, 2, 4, 3]
        }, {
            data: [4, 2, 3, 1, 3],
            yAxis: 1
        }],
        yAxis: [{
            height: '48%',
            lineWidth: 1
        }, {
            height: '48%',
            lineWidth: 1,
            top: '52%'
        }],
        xAxis: {
            gridLineWidth: 1
        }
    });

    assert.strictEqual(
        chart.container.querySelectorAll('.highcharts-xaxis-grid path')[0]
            .getAttribute('d')
            .split(' ')
            .filter(d => d === 'M').length,
        2,
        'There should be two path segments in the grid line path'
    );
});
