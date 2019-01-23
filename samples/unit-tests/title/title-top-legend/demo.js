QUnit.test('The title should not apply top margin, when legend is on top (#9964)', function (assert) {

    var chart = Highcharts.chart('container', {
        title: {
            text: ''
        },
        legend: {
            align: 'center',
            verticalAlign: 'top',
            layout: 'vertical'
        },
        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
    });


    assert.strictEqual(
        chart.options.title.margin,
        0,
        'Margin is not applied.'
    );

});