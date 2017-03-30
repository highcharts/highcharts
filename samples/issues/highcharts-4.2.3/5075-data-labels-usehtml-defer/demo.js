
QUnit.test('Data labels, useHTML and defer', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [{
            type: 'column',
            animation: true,
            dataLabels: {
                enabled: true,
                useHTML: true,
                defer: true
            },
            data: [1000, 2000, 3000]
        }]
    });

    assert.strictEqual(
        chart.series[0].dataLabelsGroup.div.nodeName,
        'DIV',
        'The data labels group has a HTML counterpart'
    );
    assert.strictEqual(
        chart.series[0].dataLabelsGroup.div.style.opacity,
        '0',
        'And that div is hidden'
    );
});