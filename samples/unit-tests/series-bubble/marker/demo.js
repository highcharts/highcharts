QUnit.test('Global marker is null (#6321)', function (assert) {

    var chart = Highcharts.chart('container', {

        chart: {
            type: 'bubble'
        },

        plotOptions: {
            series: {
                animation: false,
                marker: {
                    enabled: null
                }
            }
        },

        series: [{
            data: [
                { x: 3, y: 1, z: 1, name: 'BE', country: 'Belgium' },
                { x: 3, y: 5, z: 1, name: 'FI', country: 'Finland' }
            ]
        },
        {
            data: [
                { x: 1, y: 1, z: 1, name: 'BE', country: 'Belgium' },
                { x: 4, y: 5, z: 1, name: 'FI', country: 'Finland' }
            ]
        }]

    });

    assert.strictEqual(
        typeof chart.series[0].points[0].graphic,
        'object',
        'Has marker'
    );
});

QUnit.test('Markers are clipped (#6296)', function (assert) {
    var chart = Highcharts.chart('container', {
            chart: {
                type: 'bubble'
            },
            xAxis: {
                min: 0
            },
            series: [{
                data: [[0, 1, 2], [2, 3, 4]]
            }]
        });

    assert.strictEqual(
        chart.series[0].markerGroup.attr('clip-path') !== 'none',
        true,
        'Markers group have a clippping path'
    );
});