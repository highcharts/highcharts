QUnit.test('Single point is null (#6637)', function (assert) {

    var chart = Highcharts.chart('container', {

        chart: {
            type: 'bubble'
        },

        series: [{
            data: [
                { x: 95, y: null, z: 13.8, name: 'BE', country: 'Belgium' },
                { x: 86.5, y: 102.9, z: 14.7, name: 'DE', country: 'Germany' }
            ]
        }]

    });

    assert.strictEqual(
        typeof chart.series[0].points[1].graphic,
        'object',
        'Series is displayed.'
    );
});