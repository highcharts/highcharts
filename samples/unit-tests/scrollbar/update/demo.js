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
