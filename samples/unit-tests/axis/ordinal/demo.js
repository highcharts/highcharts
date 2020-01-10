QUnit.test('Ordinal general tests.', function (assert) {
    var chart = Highcharts.stockChart('container', {
            chart: {
                width: 500
            },
            yAxis: {
                opposite: false
            },
            xAxis: {
                min: 1458054620689
            },
            series: [{
                type: 'column',
                data: [
                    [1451577600000, 305899579],
                    [1454256000000, 303016703],
                    [1456761600000, 308008429],
                    [1459440000000, 328699625],
                    [1462032000000, 350010305],
                    [1464710400000, 365809905],
                    [1467302400000, 364839585],
                    [1469980800000, 386193804],
                    [1472659200000, 387630083],
                    [1475251200000, 405138911]
                ]
            }]
        }),
        tickPositions = chart.xAxis[0].tickPositions;

    assert.ok(
        tickPositions[0] >= chart.xAxis[0].min,
        'First tick should be greater than axis min when ordinal is enabled (#12716).'
    );

    chart.update({
        xAxis: {
            min: 1451577600000,
            max: 1472316189645.8,
            reversed: true
        },
        yAxis: {
            reversed: true
        }
    });

    tickPositions = chart.xAxis[0].tickPositions;

    assert.ok(
        tickPositions[tickPositions.length - 1] <= chart.xAxis[0].max,
        'Last tick should be smaller than axis max when ordinal is enabled (#12716).'
    );
});

QUnit.test('#1011 - Artifacts in top left corner when usign ordinal axis and ignoreHiddenSeries.', function (assert) {
    var chart = new Highcharts.StockChart({
            chart: {
                renderTo: 'container',
                ignoreHiddenSeries: false
            },
            rangeSelector: {
                selected: 1
            },
            legend: {
                enabled: true
            },
            series: [{
                data: usdeur
            }, {
                data: usdeur
            }]
        }),
        initialTicks = chart.xAxis[0].tickPositions.slice(),
        hiddenTicks;

    chart.series[0].hide();
    chart.series[1].hide();

    hiddenTicks = chart.xAxis[0].tickPositions;

    assert.deepEqual(
        initialTicks,
        hiddenTicks,
        'The same tick positions.'
    );
});


QUnit.test(
    'Ordinal axis and lazy loading',
    function (assert) {
        var chart = Highcharts.stockChart('container', {
            chart: {
                width: 600
            },
            xAxis: {
                events: {
                    afterSetExtremes: function () {
                        this.chart.series[0].setData([
                            [883612800000, 3.41],
                            [886291200000, 4.62],
                            [1314835200000, 385.03],
                            [1317427200000, 379.96]
                        ]);
                    }
                },
                minRange: 3600 * 1000 // one hour
            },
            navigator: {
                adaptToUpdatedData: false,
                series: {
                    data: [
                        [883612800000, 0],
                        [1317427200000, 1]
                    ]
                }
            },
            series: [{
                type: 'area',
                data: [
                    [1318618860000, 421.37],
                    [1318618980000, 421.45],
                    [1318619040000, 421.45],
                    [1318619100000, 421.31],
                    [1318619160000, 421.32],
                    [1318622040000, 421.88],
                    [1318622100000, 421.95],
                    [1318622160000, 421.98],
                    [1318622220000, 421.95],
                    [1318622340000, 422]
                ]
            }]
        });

        chart.rangeSelector.clickButton(5, true);

        Highcharts.objectEach(
            chart.xAxis[0].ticks,
            tick => {
                assert.strictEqual(
                    tick.isNew,
                    false,
                    'Tick ' + tick.label.textStr + ' rendered (#10290)'
                );
            }
        );
    }
);