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

// Highcharts 4.1.1, Issue #3830
// After updating "xAxis" categories empty (Data defined in a HTML table)
QUnit.test('Update axis names (#3830)', function (assert) {

    var chart = Highcharts.chart('container', {
        xAxis: {
            type: 'category'
        },
        series: [{
            data: [
                ['Apples', 1],
                ['Pears', 2],
                ['Oranges', 3]
            ]
        }]
    });

    assert.strictEqual(
        chart.xAxis[0].labelRotation,
        undefined,
        'Axis labels should not be rotated'
    );

    chart.xAxis[0].update({ labels: { rotation: -90 } });

    assert.strictEqual(
        chart.xAxis[0].labelRotation,
        -90,
        'Axis labels should not be rotated'
    );

    assert.ok(
        chart.xAxis[0] &&
        chart.xAxis[0].labelGroup &&
        chart.xAxis[0].labelGroup.element &&
        chart.xAxis[0].labelGroup.element
            .getElementsByTagName('text')[0]
            .getAttribute('transform')
            .indexOf(' rotate(-90 ') > 0,
        'Axis labels group should be transform rotation by 90 deg.'
    );

});