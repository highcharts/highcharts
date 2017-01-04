QUnit.test('Chart destroy', function (assert) {

    var chart = Highcharts.charts[0];

    chart.destroy();

    assert.strictEqual(
        chart.series,
        undefined,
        'Properties deleted'
    );

    assert.strictEqual(
        document.getElementById('container').innerHTML,
        '',
        'Container emptied'
    );
});

QUnit.test('Chart destroy from its own callback', function (assert) {

    assert.expect(0);
    Highcharts.chart('container', {

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
            type: 'column'
        }]

    }, function () {
        this.destroy();
    });

});