// Highcharts 4.1.1, Issue #3898
// negativeColor not rendered correctly when threshold is out of range
QUnit.test('Spline zones out of range', function (assert) {

    var chart = Highcharts.chart('container', {
            title: {
                text: 'Zones were not applied correctly if they were out of range'
            },
            yAxis: {
                tickPositioner: function () {
                    return [-6, -4, -2];
                }
            },
            series: [{
                type: 'spline',
                data: [-4, -3, -2, -3, -2, -4],
                color: '#00f', // setup default zones
                negativeColor: '#f00', // setup default zones
                threshold: 0
            }]
        }),
        series = chart.series[0];

    assert.strictEqual(
        series.data[0].graphic.element.getAttribute('fill'),
        '#f00',
        'Point color should be red.'
    );

    assert.strictEqual(
        series.data[2].graphic.element.getAttribute('fill'),
        '#f00',
        'Point color should be red.'
    );

    assert.strictEqual(
        series.data[5].graphic.element.getAttribute('fill'),
        '#f00',
        'Point color should be red.'
    );

});