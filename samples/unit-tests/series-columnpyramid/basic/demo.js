QUnit.test('Column pyramid series', function (assert) {

    var chart = Highcharts.chart('container', {
        chart: {
            renderTo: 'container',
            type: 'columnpyramid'
        },
        series: [{
            data: [
                10,
                20,
                5
            ]
        }]
    });

    assert.ok(
        chart.series[0].points[1].graphic.d && chart.series[0].points[1].graphic !== 'rect',
        'Shapes are paths - pyramids'
    );

});