QUnit.test('Temperaturemap API options.', function (assert) {

    const chart = new Highcharts.MapChart('container', {
        
        chart: {
            map: Highcharts.maps['countries/bn/bn-all']
        },
        series: [{}, {
            type: 'temperaturemap',
            data: [{
                "hc-key": "bn-te",
                z: 1
            }, {
                "hc-key": "bn-be",
                z: 3
            }],
            sizeBy: 'width',
            minSize: 50,
            maxSize: 200,
            color: 'rgba(255,0,255,0)',
            temperatureColors: ['#0000ff', '#00ffff', '#00ff00', '#ffff00', '#ff0000']
        }]
    });

    const series = chart.series[1];

    assert.ok(
        true,
        'No errors.'
    );

    assert.strictEqual(
        series.data[0].color,
        'rgba(255,0,255,0)',
        'Color should have a value of "rgba(255,0,255,0)".'
    );

    assert.strictEqual(
        series.data[0].z,
        1,
        'The value of z should be 1.'
    );

    assert.strictEqual(
        series.joinBy[0],
        'hc-key',
        'JoinBy should be defined as "hc-key".'
    );

    assert.strictEqual(
        series.options.type,
        'temperaturemap',
        'The series type should be "temperaturemap".'
    );

    assert.strictEqual(
        series.options.minSize,
        50,
        'MinSize should be 50.'
    );

    assert.strictEqual(
        series.options.maxSize,
        200,
        'MaxSize should be 200.'
    );

    series.update({
        temperatureColors: [[0.2, '#0000ff'], [0.4, '#00ffff']]
    });

    assert.strictEqual(
        series.options.temperatureColors[0][0],
        0.2,
        'TemperatureColors should have a value for the color.'
    );
});
