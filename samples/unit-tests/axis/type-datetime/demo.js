// Highcharts 3.0.10, Issue #2846
// Possible Bug Associated with #2610
QUnit.test('Single point padding (#2846)', function (assert) {

    var chart = Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Issue #2846 caused 1px columns, overlapping in the center'
            },
            xAxis: {
                type: 'datetime'
            },
            series: [{
                data: [
                    [Date.UTC(1971, 0, 1), 10]
                ]
            }, {
                data: [
                    [Date.UTC(1971, 0, 1), 10]
                ]
            }, {
                data: [
                    [Date.UTC(1971, 0, 1), 10]
                ]
            }]
        }),
        series1 = chart.series[0],
        series2 = chart.series[1],
        series3 = chart.series[2];



    assert.notEqual(
        Math.round(series1.pointXOffset),
        Math.round(series2.pointXOffset),
        'The x offset should not be nearly identical.'
    );

    assert.notEqual(
        Math.round(series2.pointXOffset),
        Math.round(series3.pointXOffset),
        'The x offset should not be nearly identical.'
    );

    assert.ok(
        Math.round(series1.data[0].pointWidth)  > 1 &&
        Math.round(series2.data[0].pointWidth)  > 1 &&
        Math.round(series3.data[0].pointWidth)  > 1,
        'The point width should be larger than about 1 pixel.'
    );

});
