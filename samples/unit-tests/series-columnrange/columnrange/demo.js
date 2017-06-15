

QUnit.test('Long columns and bars (#6835)', function (assert) {

    var chart = Highcharts.chart('container', {
        chart: {
            renderTo: 'container',
            type: 'columnrange',
            inverted: true,
            width: 1200
        },
        yAxis: {
            reversed: false,
            min: 99.170523,
            max: 99.170536
        },
        series: [{
            data: [
                [99.1, 99.3],
                [99.0, 99.8]
            ]
        }]
    });

    assert.ok(
        chart.series[0].points[1].graphic.getBBox().height < 150000,
        'Acceptable height'
    );

});