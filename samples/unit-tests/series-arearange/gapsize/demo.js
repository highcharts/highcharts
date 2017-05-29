

QUnit.test('Gap size in area range', function (assert) {
    var chart = Highcharts.chart('container', {

        chart: {
            type: 'arearange'
        },

        xAxis: {
            type: 'datetime'
        },

        plotOptions: {
            series: {
                gapSize: 1
            }
        },

        series: [{
            data: [
                [0, 1, 2],
                [1, 2, 3],
                [2, 3, 4],
                [4, 4, 5],
                [5, 5, 6],
                [6, 6, 7]
            ],
            lineColor: 'black',
            lineWidth: 2
        }]
    });

    assert.ok(
        chart.series[0].graph.attr('d').lastIndexOf('M') > 150,
        'moveTo command on lower line'
    );

});