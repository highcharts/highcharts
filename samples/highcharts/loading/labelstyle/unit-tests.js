QUnit.test('Label style', function (assert) {
    var chart = Highcharts.charts[0],
        label;

    chart.showLoading();

    label = document.querySelector('.highcharts-loading span');
    assert.equal(
        label.nodeName,
        'SPAN',
        'Inner label is there'
    );
    assert.equal(
        window.getComputedStyle(label, '').fontStyle,
        'italic',
        'Computed style is italic'
    );

});