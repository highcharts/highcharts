QUnit.test('Get selected series', function (assert) {
    var chart = Highcharts.charts[0];



    assert.strictEqual(
        chart.getSelectedSeries().length,
        0,
        '0 selected series'
    );

    // Set the checked state and click it through the adapter
    chart.container.querySelectorAll('input')[0].setAttribute('checked', 'true');
    $(chart.container.querySelectorAll('input')[0]).click();

    assert.strictEqual(
        chart.getSelectedSeries().length,
        1,
        '1 selected series'
    );

    // Set the checked state and click it through the adapter
    chart.container.querySelectorAll('input')[1].setAttribute('checked', 'true');
    $(chart.container.querySelectorAll('input')[1]).click();

    assert.strictEqual(
        chart.getSelectedSeries().length,
        2,
        '2 selected series'
    );

    // Set the checked state and click it through the adapter
    chart.container.querySelectorAll('input')[0].setAttribute('checked', 'false');
    $(chart.container.querySelectorAll('input')[0]).click();

    assert.strictEqual(
        chart.getSelectedSeries().length,
        1,
        '1 selected series'
    );


});