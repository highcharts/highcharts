QUnit.test('Check that it doesn\'t fail (#6655)', function (assert) {
    var chart = Highcharts.stockChart('container', {
        chart: {
            width: 500
        },
        plotOptions: {
            series: {
                showInNavigator: true
            }
        },
        series: [{
            name: 'USD to EUR',
            id: 'dataseries',
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            dataGrouping: {
                forced: true
            }
        }, {
            type: 'flags',
            data: [{
                x: 1
            }],
            onSeries: 'dataseries'
        }, {
            type: 'flags',
            data: [{
                x: 3
            }],
            onSeries: 'dataseries'
        }]
    });

    assert.notEqual(
        chart.navigator.series[0].graph.getBBox().width,
        0,
        'Visible series in navigator'
    );
});