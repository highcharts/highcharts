$(function () {
    QUnit.test('Gauge background', function (assert) {
        $('#container').highcharts({
            chart: {
                type: "gauge"
            },
            "series": [{
                data: [10]
            }]
        });
        $('#container').highcharts({
            id: 'LINE',
            chart: {
                polar: true,
                type: 'line'
            },
            series: [{
                data: [1,1,1,1]
            }]
        });

        assert.strictEqual(
            $('#container').highcharts().xAxis[0].plotLinesAndBands.length,
            0,
            'No plot bands exist'
        );

    });

});