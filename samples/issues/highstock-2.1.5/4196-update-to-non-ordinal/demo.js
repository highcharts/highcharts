$(function () {

    QUnit.test('Update to non-ordinal', function (assert) {

        var data = [/* Jun 2006 */
            [1149120000000,62.17],
            [1149206400000,61.66],
            [1149465600000,60.00],
            [1149552000000,59.72],
            [1149638400000,58.56],
            [1149724800000,60.76],
            [1149811200000,59.24],
            [1150070400000,57.00],
            [1150156800000,58.33],
            [1150243200000,57.61],
            [1150329600000,59.38],
            [1150416000000,57.56],
            [1150675200000,57.20],
            [1150761600000,57.47],
            [1150848000000,57.86],
            [1150934400000,59.58],
            [1151020800000,58.83],
            [1151280000000,58.99],
            [1151366400000,57.43],
            [1151452800000,56.02],
            [1151539200000,58.97],
            [1151625600000,57.27]
        ];

        // Create the chart
        $('#container').highcharts('StockChart', {


            rangeSelector : {
                selected : 1
            },

            title : {
                text : 'AAPL Stock Price'
            },

            xAxis: {
                ordinal: true
            },

            series : [{
                name : 'AAPL Stock Price',
                data : data,
                marker : {
                    enabled : true,
                    radius : 3
                },
                shadow : true,
                tooltip : {
                    valueDecimals : 2
                },
                animation: false
            }]
        });

        var chart = $('#container').highcharts(),
            xAxis = chart.xAxis[0],
            points = chart.series[0].points;


        // In an ordinal axis, the point distance is the same even though the actual time distance is
        // different.
        assert.equal(
            Math.round(points[1].plotX - points[0].plotX),
            Math.round(points[2].plotX - points[1].plotX),
            'Ordinal'
        );

        xAxis.update({
            ordinal: !xAxis.options.ordinal
        });

        // In a non-ordinal axis, the point distance reflects the time distance.
        assert.equal(
            3 * (points[1].plotX - points[0].plotX),
            points[2].plotX - points[1].plotX,
            'Non-ordinal'
        );
    });
});