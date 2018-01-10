

QUnit.test('Null threshold (#7420)', function (assert) {

    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        plotOptions: {
            series: {
                stacking: 'normal',
                threshold: null
            }
        },

        series: [{
            data: [1]
        }, {
            data: [2]
        }]
    });

    assert.notEqual(
        chart.series[0].points[0].graphic.element.getBBox().height,
        0,
        'The points should have an extent'
    );
});