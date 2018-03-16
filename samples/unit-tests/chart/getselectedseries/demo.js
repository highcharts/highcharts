
QUnit.test('Get selected series', function (assert) {

    var chart = Highcharts
        .chart('container', {
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            plotOptions: {
                series: {
                    showCheckbox: true
                }
            },
            series: [{
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
            }, {
                data: [194.1, 95.6, 54.4, 9.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4]
            }]
        });

    assert.strictEqual(
        chart.getSelectedSeries().length,
        0,
        '0 selected series'
    );

    // Set the checked state and click it through the adapter
    chart.container.querySelectorAll('input')[0].setAttribute('checked', 'true');
    chart.container.querySelectorAll('input')[0].dispatchEvent(new Event('click'));

    assert.strictEqual(
        chart.getSelectedSeries().length,
        1,
        '1 selected series'
    );

    // Set the checked state and click it through the adapter
    chart.container.querySelectorAll('input')[1].setAttribute('checked', 'true');
    chart.container.querySelectorAll('input')[1].dispatchEvent(new Event('click'));

    assert.strictEqual(
        chart.getSelectedSeries().length,
        2,
        '2 selected series'
    );

    // Set the checked state and click it through the adapter
    chart.container.querySelectorAll('input')[0].setAttribute('checked', 'false');
    chart.container.querySelectorAll('input')[0].dispatchEvent(new Event('click'));

    assert.strictEqual(
        chart.getSelectedSeries().length,
        1,
        '1 selected series'
    );

});