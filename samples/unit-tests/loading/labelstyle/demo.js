
QUnit.test('Label style', function (assert) {

    var chart = Highcharts
        .chart('container', {
            loading: {
                labelStyle: {
                    fontStyle: 'italic'
                }
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            series: [{
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
            }]
        }),
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
