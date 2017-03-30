

QUnit.test('Pyramid centering (issue #5500)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'pyramid'
        },
        plotOptions: {
            series: {
                width: "50%",
                height: "50%"
            }
        },
        series: [{
            name: 'Unique users',
            data: [
                ['a', 100],
                ['b', 100],
                ['c', 100]
            ],
            center: ["25%", "75%"]
        }]
    });

    assert.ok(
        chart.series[0].group.getBBox().y >= (chart.plotHeight / 2) - 2, // substract two for future rounding adjustments
        'Pyramid is in lower half'
    );
});