jQuery(function () {

    QUnit.test('Check last point visible', function (assert) {

        var chart = Highcharts.chart('container', {

            chart: {
                type: 'heatmap'
            },


            title: {
                text: 'Heatmap data label alignment'
            },

            series: [{
                data: [
                    [0, 0, 10],
                    [0, 1, 19],
                    [1, 0, 8],
                    [1, 1, 24]
                ],
                dataLabels: {
                    enabled: true,
                    verticalAlign: 'bottom',
                    align: 'left'
                },
                borderColor: 'white',
                borderWidth: 2
            }]

        });

        var point = chart.series[0].points[0];
        var leftX = point.dataLabel.translateX;
        var bottomY = point.dataLabel.translateY;
        assert.strictEqual(
            typeof leftX,
            'number',
            'All well so far'
        );

        chart.series[0].update({
            dataLabels: {
                verticalAlign: 'top',
                align: 'right'
            }
        });

        point = chart.series[0].points[0];
        assert.ok(
            point.dataLabel.translateX > leftX,
            'align:right gives a higher X position than align:left'
        );

        assert.ok(
            point.dataLabel.translateY < bottomY,
            'verticalAlign:top gives a smaller Y position than verticalAlign:bottom'
        );

    });
});