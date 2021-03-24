QUnit.test('Price indicator styling.', function (assert) {

    var chart = Highcharts.stockChart('container', {
        series: [{
            data: [1],
            lastPrice: {
                enabled: true,
                color: '#00ff00' // To be overridden by css highcharts-color
            }
        }]
    });

    assert.ok(
        chart.series[0].lastPrice.element.classList
            .contains('highcharts-color-0'),
        'CSS class of highcharts-color-{x} ' +
            'should be added to lastPrice (#15222)'
    );
});
