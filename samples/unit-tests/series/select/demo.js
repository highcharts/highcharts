
QUnit.test('Select and unselect updates checkbox', function (assert) {

    var chart = Highcharts.chart('container', {
        plotOptions: {
            series: {
                showCheckbox: true
            }
        },
        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }, {
            data: [129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4]
        }]
    });

    var series = chart.series[0];

    assert.strictEqual(
        series.checkbox.checked,
        false,
        'Not checked'
    );

    series.select();

    assert.strictEqual(
        series.checkbox.checked,
        true,
        'Checked'
    );

    series.select(false);
    assert.strictEqual(
        series.checkbox.checked,
        false,
        'Checked'
    );

});
