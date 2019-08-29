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