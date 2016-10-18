$(function () {

    QUnit.test('Color axis padding', function (assert) {

        var chart;

        $('#container').highcharts({

            chart: {
                type: 'heatmap'
            },
            colorAxis: {
                min: -1,
                max: 1
            },


            series: [{
                data: [[0, 0, -1], [0, 1, 1]]
            }]

        });

        chart = $('#container').highcharts();

        assert.strictEqual(
            chart.colorAxis[0].toPixels(-1),
            0,
            'No left padding'
        );


    });



});