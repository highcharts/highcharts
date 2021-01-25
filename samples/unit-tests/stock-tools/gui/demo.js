QUnit.test('Stocktools GUI', function (assert) {
    /*const chart = */Highcharts.stockChart('container', {
        stockTools: {
            gui: {
                enabled: true,
                definitions: {
                    measure: {
                        items: ['measureX']
                    }
                }
            }
        },
        title: {
            text: 'Chart title',
            align: 'left'
        },
        legend: {
            enabled: true,
            align: 'left'
        },
        series: [
            {
                data: [1, 2, 3]
            }
        ]
    });

    assert.ok(
        1,
        'No errors should be thrown after setting just one item (#10980)'
    );

    // This doesnt work outside highcharts-utils, possibly because it needs
    // the css
    /*
    const spacing = Highcharts.defaultOptions.chart.spacing[3];
    const offset = spacing + chart.stockTools.listWrapper.offsetWidth;

    assert.strictEqual(
        chart.legend.group.translateX,
        offset,
        '#9744: Legend should have correct position'
    );
    assert.strictEqual(
        chart.title.attr('x'),
        offset,
        '#9744: Title should have the correct position'
    );

    Highcharts.fireEvent(chart.stockTools.showhideBtn, 'click');

    assert.strictEqual(
        chart.legend.group.translateX,
        spacing,
        '#9744: Legend should have correct position after hiding toolbar'
    );
    assert.strictEqual(
        chart.title.attr('x'),
        spacing,
        '#9744: Title should have the correct position after hiding toolbar'
    );
    */
});
