QUnit.test('Legend should be rendered below the range selector', function (assert) {
    var chart = Highcharts.stockChart('container', {
        rangeSelector: {
            enabled: true,
            inputEnabled: false,
            buttonPosition: {
                align: 'right'
            }
        },
        legend: {
            enabled: true,
            align: 'left',
            verticalAlign: 'top'
        },
        series: [{
            data: [101, 343, 11]
        }]
    });
    assert.ok(
        chart.legend.group.element.getBoundingClientRect().top >=
            chart.rangeSelector.group.element.getBoundingClientRect().bottom,
        'The legend is rendered below the range selector.'
    );
});