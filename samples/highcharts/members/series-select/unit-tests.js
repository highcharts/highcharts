QUnit.test('Select and unselect updates checkbox', function (assert) {

    var series = Highcharts.charts[0].series[0];

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