QUnit.test(
    'Column with xAxis lineWidth in Highcharts Stock (#8031).',
    function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            xAxis: {
                lineWidth: 17
            },
            yAxis: {
                min: 0
            },
            series: [
                {
                    data: [400, 124, -100]
                }
            ]
        });

        assert.strictEqual(
            parseInt(chart.sharedClips[chart.series[0].sharedClipKey].attr('height'), 10),
            chart.yAxis[0].len -
                Math.floor(chart.xAxis[0].userOptions.lineWidth / 2),
            'The column should be clipped to the edge of the X axis line'
        );

        chart.yAxis[0].update({
            height: '80%'
        });

        assert.strictEqual(
            parseInt(chart.sharedClips[chart.series[0].sharedClipKey].attr('height'), 10),
            chart.yAxis[0].len,
            'The column should be clipped to the length of the Y axis'
        );
    }
);
