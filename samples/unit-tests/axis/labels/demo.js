QUnit.test('Label ellipsis in Firefox (#5968)', function (assert) {

    var chart = Highcharts.chart('container', {

        chart: {
            width: 500
        },

        xAxis: {
            labels: {
                rotation: 0
            },
            categories: ['January', 'January', 'January', 'January', 'January', 'January',
                'January', 'January', 'January', 'January', 'January', 'January'
            ]
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
            type: 'column'
        }]

    });


    assert.strictEqual(
        chart.xAxis[0].ticks[0].label.element.getBBox().width,
        chart.xAxis[0].ticks[11].label.element.getBBox().width,
        'All labels should have ellipsis and equal length'
    );
});
