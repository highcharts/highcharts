$(function () {
    QUnit.test('Point range after setData', function (assert) {
        var chart,
            initialPointRange;

        // Create the chart
        $('#container').highcharts({

            chart: {
                type: 'heatmap'
            },

            colorAxis: {
                min: 0,
                minColor: '#FFFFFF',
                maxColor: '#000000'
            },

            series: [{
                data: [
                    [1, 0, 92],
                    [2, 0, 35],
                    [3, 0, 72],
                    [4, 0, 38],
                    [5, 0, 88],
                    [6, 0, 13],
                    [7, 0, 31],
                    [8, 0, 85],
                    [9, 0, 47]
                ]
            }]

        });

        chart = $('#container').highcharts();
        initialPointRange = chart.series[0].pointRange;

        // Run setData
        chart.series[0].setData([
            [1, 0, 92],
            [2, 0, 35],
            [3, 0, 72],
            [4, 0, 38],
            [5, 0, 88],
            [6, 0, 13],
            [7, 0, 31],
            [8, 0, 85],
            [9, 0, 47],
            [10, 0, 47],
            [11, 0, 47],
            [12, 0, 47]
        ]);

        assert.equal(
            chart.series[0].pointRange,
            initialPointRange,
            'Point range should not change'
        );
    });

});