

QUnit.test('Individual border color', function (assert) {

    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        plotOptions: {
            column: {
                color: '#2f7ed8',
                borderColor: '#0000aa',
                borderWidth: 5
            }
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, {
                y: 216.4,
                color: '#BF0B23',
                borderColor: '#BF0B23'
            }, 194.1, 95.6, 54.4]
        }]
    });

    assert.strictEqual(
        chart.series[0].points[8].graphic.attr('stroke').toLowerCase(),
        '#bf0b23',
        'Initial color'
    );

});