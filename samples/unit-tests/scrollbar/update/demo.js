QUnit.test('#6615 - enabling and disabling chart.scrollbar was broken.', function (assert) {
    var chart = Highcharts.stockChart('container', {
        scrollbar: {
            enabled: false
        },
        series: [{
            data: [4, 20, 100, 5, 2, 33, 12, 23]
        }]
    });

    chart.update({
        scrollbar: {
            enabled: true
        }
    });

    assert.strictEqual(
        !!chart.navigator.scrollbar,
        true,
        'Scrollbar rendered.'
    );

    chart.update({
        scrollbar: {
            enabled: false
        }
    });

    assert.strictEqual(
        !chart.navigator.scrollbar,
        true,
        'Scrollbar removed.'
    );

});

QUnit.test('Remove base series with scrollbar only (#7378)', function (assert) {

    var chart = Highcharts.chart('container', {
        scrollbar: {
            enabled: true
        },
        series: [{
            data: [1, 2, 3]
        }]
    });

    chart.series[0].remove(true, false);

    assert.strictEqual(
        chart.container.innerHTML.indexOf('NaN'),
        -1,
        'Index of NaN in SVG should be -1'
    );
});
