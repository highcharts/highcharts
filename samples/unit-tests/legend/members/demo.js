QUnit.test('Legend.renderItem', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [{
                className: 'className'
            }]
        }),
        element = chart.legend.allItems[0].group.element,
        classNames = element.getAttribute('class').split(' ');

    assert.strictEqual(
        classNames.indexOf('highcharts-line-series') > -1,
        true,
        'className for series type is added.'
    );
    assert.strictEqual(
        classNames.indexOf('highcharts-color-0') > -1,
        true,
        'className for color is added.'
    );
    assert.strictEqual(
        classNames.indexOf('className') > -1,
        true,
        'className for series.className is added.'
    );
    assert.strictEqual(
        classNames.indexOf('highcharts-series-0') > -1,
        true,
        'className for series index is added.'
    );
});
