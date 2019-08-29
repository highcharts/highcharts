QUnit.test('Undefined lang', function (assert) {

    var chart = Highcharts
        .chart('container', {
            lang: {
                loading: undefined
            },
            series: [{
                data: [1, 2, 3]
            }]
        });

    chart.showLoading();

    assert.equal(
        chart.loadingDiv.childNodes[0].innerHTML,
        '',
        'undefined value is not draw'
    );

});