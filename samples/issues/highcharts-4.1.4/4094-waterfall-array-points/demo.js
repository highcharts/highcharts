$(function () {
    QUnit.test('Waterfall point definitions', function (assert) {
        $('#container').highcharts({
            chart: {
                type: 'waterfall'
            },

            xAxis: {
                type: 'datetime'
            },

            series: [{
                data: [
                    [Date.UTC(2015, 0, 1), 10],
                    [Date.UTC(2015, 0, 2), 15],
                    [Date.UTC(2015, 0, 3), 5],
                    [Date.UTC(2015, 0, 4), 7]
                ]
            }]
        });

        var chart = $('#container').highcharts();
        assert.equal(
            chart.xAxis[0].dataMin,
            Date.UTC(2015, 0, 1),
            'X Axis min'
        );
        assert.equal(
            chart.xAxis[0].dataMax,
            Date.UTC(2015, 0, 4),
            'X Axis max'
        );
    });

});