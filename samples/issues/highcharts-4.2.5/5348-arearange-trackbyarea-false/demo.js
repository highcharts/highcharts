QUnit.test('Area range with trackByArea:false', function (assert) {

    var chart = Highcharts.chart('container', {

        plotOptions: {
            arearange: {
                trackByArea: false
            }
        },

        series: [{
            data: [
                [1, 2],
                [2, 3],
                [3, 4]
            ],
            type: 'arearange'
        }]

    });

    assert.strictEqual(
        chart.series[0].graphPath[0],
        'M',
        'Graph path starts with moveTo command'
    );
});