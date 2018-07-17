QUnit.test('destroy. #6488', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'heatmap'
        },
        colorAxis: {
            id: 'col-ax',
            min: 0,
            minColor: '#FFFFFF',
            maxColor: Highcharts.getOptions().colors[0]
        },
        series: [{
            borderWidth: 1,
            data: [
              [0, 0, 10],
              [0, 1, 19]
            ]
        }]
    });

    chart.get('col-ax').remove();

    assert.strictEqual(
        chart.colorAxis.length,
        0,
        'Color axis is destroyed.'
    );

    assert.strictEqual(
        chart.legend.display,
        false,
        'Legend is hidden.'
    );
});
