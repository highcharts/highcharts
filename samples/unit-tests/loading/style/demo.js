
QUnit.test('Label style', function (assert) {

    var chart = Highcharts
        .chart('container', {
            loading: {
                labelStyle: {
                    color: 'white'
                },
                style: {
                    backgroundColor: 'gray'
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