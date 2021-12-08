QUnit.test('Legend symbol transparency', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'area'
        },
        series: [
            {
                data: [1, 3, 2, 4],
                fillOpacity: 0.5
            }
        ]
    });

    assert.equal(
        chart.legend.allItems[0].legendSymbol.element.getAttribute(
            'fill-opacity'
        ),
        0.5,
        'The legend symbol of the first element should be the same as the fillOpacity.'
    );
});
