QUnit.test('Check input format', function (assert) {

    var chart = Highcharts.charts[0];

    assert.strictEqual(
        chart.rangeSelector.minDateBox.element.textContent,
        '00:00:00.000',
        'Starts at 0'
    );

    assert.strictEqual(
        chart.xAxis[0].min,
        0,
        'Axis is initiated'
    );


    // Activate it and set range
    chart.rangeSelector.showInput('min');
    chart.rangeSelector.minInput.value = '00:00:00.010';
    chart.rangeSelector.minInput.onchange();

    assert.strictEqual(
        chart.rangeSelector.minDateBox.element.textContent,
        '00:00:00.010',
        'Min has changed'
    );

    assert.strictEqual(
        chart.xAxis[0].min,
        10,
        'Axis has changed'
    );

});