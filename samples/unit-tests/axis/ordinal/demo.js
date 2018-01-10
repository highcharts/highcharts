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