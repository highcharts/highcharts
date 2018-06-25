QUnit.test('The negativeColor in waterfall (#7862)', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [{
            type: 'waterfall',
            negativeColor: '#FF0000',
            data: [120000, 569000, 231000, -342000, -233000]
        }]
    });

    // Test: the visibility of the graph
    assert.notEqual(
        chart.series[0].graph.attr('visibility'),
        'hidden',
        'The lines between columns are visible.'
    );
});
