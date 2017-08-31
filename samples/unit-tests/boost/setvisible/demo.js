QUnit.test('Boosted series show/hide', function (assert) {

    var chart = Highcharts.chart('container', {
        plotOptions: {
            series: {
                boostThreshold: 1
            }
        },
        series: [{
            data: [1, 3, 2, 4],
            visible: false
        }, {
            data: [4, 2, 5, 3]
        }]
    });

    var s = chart.series[0];

    assert.strictEqual(
        s.image.attr('href'),
        '',
        'Empty image for the initially hidden series'
    );

    s.show();

    assert.strictEqual(
        s.image.attr('href').indexOf('data:image/png;base64,'),
        0,
        'Painted image for the visible series'
    );

    s.hide();
    assert.strictEqual(
        s.image.attr('href'),
        '',
        'Empty image for the dynamically hidden series'
    );

});
