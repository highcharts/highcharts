/* eslint func-style:0 */
$(function () {

    QUnit.test('Axis setExtremes caused padded axis (#5662)', function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                polar: true
            },
            xAxis: {
                maxPadding: 0,
                minPadding: 0
            },
            series: [{
                data: [67, 29, 70, 91, 59, 53, 17, 63, 20, 31, 31]
            }]

        });


        assert.strictEqual(
            chart.xAxis[0].max,
            11,
            'Axis initially padded as per autoConnect'
        );


        chart.xAxis[0].setExtremes(4, 10);

        assert.strictEqual(
            chart.xAxis[0].max,
            10,
            'Data max same as before, but padding is now gone because we have hard extremes.'
        );

    });

});