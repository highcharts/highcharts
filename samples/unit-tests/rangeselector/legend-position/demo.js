QUnit.test('Legend should be rendered below the range selector', function (assert) {
    Highcharts.stockChart('container', {
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
        document.getElementsByClassName('highcharts-legend')[0].getBoundingClientRect().top >=
        document.getElementsByClassName('highcharts-range-selector-group')[0].getBoundingClientRect().bottom,
        'The legend is rendered below the range selector.'
    );
});