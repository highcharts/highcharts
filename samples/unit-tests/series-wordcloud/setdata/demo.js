QUnit.test('Update the chart using the same data (#11993)', function (assert) {

    var data = [{
            name: 'Test',
            weight: 10
        }, {
            name: 'Test',
            weight: 100
        }, {
            name: 'Test',
            weight: 1000
        }],
        chart = Highcharts.chart('container', {
            chart: {
                type: 'wordcloud',
                height: 500,
                width: 1000
            },
            series: [{
                style: {
                    fontFamily: 'Impact'
                },
                data: data
            }]
        }),
        widthBeforeUpdate = chart.series[0].points[0].graphic.getBBox(true).width;

    chart.series[0].setData(data);

    assert.strictEqual(
        widthBeforeUpdate,
        chart.series[0].points[0].graphic.getBBox(true).width,
        'Width of the element should be exactly the same after the update.'
    );
});
