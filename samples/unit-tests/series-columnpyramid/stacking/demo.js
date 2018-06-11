QUnit.test('Column pyramid series', function (assert) {

    var chart = Highcharts.chart('container', {
        chart: {
            renderTo: 'container',
            type: 'columnpyramid'
        },
        plotOptions: {
            columnpyramid: {
                stacking: 'normal'
            }
        },
        series: [{
            data: [
                10,
                20,
                5
            ]
        }, {
            data: [
                5,
                10,
                15
            ]
        }]
    });

    assert.equal(
        chart.series[0].type,
        'columnpyramid',
        'Successful columnpyramid'
    );

});