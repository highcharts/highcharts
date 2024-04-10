QUnit.test('Point type legend item', function (assert) {
    const chart = Highcharts.chart('container', {
        colorAxis: {
            minColor: 'rgb(0,0,255)',
            maxColor: 'rgb(255,0,0)',
            showInLegend: false
        },
        series: [
            {
                type: 'pie',
                showInLegend: true,
                data: [
                    {
                        y: 100
                    },
                    {
                        y: 1
                    }
                ]
            }
        ]
    });

    assert.strictEqual(
        chart.legend.allItems[0].legendItem.symbol.attr('fill'),
        'rgb(255,0,0)',
        'shoud have correct color.'
    );
});
