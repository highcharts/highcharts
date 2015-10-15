QUnit.test('Label style', function (assert) {
    var chart = Highcharts.charts[0],
        label;

    chart.showLoading();

    label = document.querySelector('.highcharts-loading');
    assert.equal(
        label.nodeName,
        'DIV',
        'Inner label is there'
    );
    assert.equal(
        window.getComputedStyle(label, '').backgroundColor,
        'rgb(128, 128, 128)',
        'Computed background is gray'
    );

});