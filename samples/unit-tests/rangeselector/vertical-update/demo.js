QUnit.test('Chart update - Spacing bottom is not ignored.', function (assert) {
    var chart = Highcharts.stockChart('container', {
        chart: {
            events: {
                load: function () {
                    this.update({});
                }
            },
            spacingBottom: 100
        },
        series: [{
            data: [1, 2, 3]
        }]
    });

    assert.strictEqual(
        chart.spacing[2],
        100,
        'spacing bottom'
    );
});