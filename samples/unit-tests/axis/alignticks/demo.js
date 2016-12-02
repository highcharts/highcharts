QUnit.test('Align ticks on logarithmic axis (#6021)', function (assert) {

    var chart = Highcharts.chart('container', {

        chart: {
            height: 500
        },
        yAxis: [{
            type: 'logarithmic'
        }, {
            type: 'linear'
        }],

        series: [{
            data: [10319, 12060],
            yAxis: 0
        }, {
            data: [1, 2],
            yAxis: 1
        }]
    });

    assert.notEqual(
        chart.yAxis[0].tickPositions.length,
        chart.yAxis[1].tickPositions.length,
        'Ticks are not aligned'
    );

});
