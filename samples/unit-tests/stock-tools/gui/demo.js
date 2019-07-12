QUnit.test('Touch event test on popup', function (assert) {

    Highcharts.stockChart('container', {
        stockTools: {
            gui: {
                definitions: {
                    measure: {
                        items: ['measureX']
                    }
                }
            }
        },
        series: [{
            data: [1, 2, 3]
        }]
    });

    assert.ok(
        1,
        'No errors should be thrown after setting just one item (#10980)'
    );
});
