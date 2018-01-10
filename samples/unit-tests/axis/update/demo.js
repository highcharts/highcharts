QUnit.test('Redraw without series (#5323)', function (assert) {

    var chart = new Highcharts.StockChart({
        chart: {
            type: 'column',
            renderTo: 'container',
            animation: false
        },
        plotOptions: {
            series: {
                animation: false
            }
        }
    });

    chart.yAxis[0].setTitle({
        text: "Bananas"
    });

    chart.addSeries({
        data: [
            [1242777600000, 17.98],
            [1242864000000, 17.74],
            [1242950400000, 17.50]
        ]
    });

    assert.strictEqual(
        chart.series[0].points.length,
        3,
        'Has series with three points'
    );
});