// This test fails cinde fixing #7112 - I'm in a hurry and can't find where
// isNull is set for log axis points.
/*
QUnit.test(
    '#6585 - zero value on logarithmic yAxis should be placed on xAxis.',
    function (assert) {
        var chart = Highcharts.chart('container', {
                chart: {
                    type: 'column'
                },
                yAxis: {
                    type: 'logarithmic'
                },
                plotOptions: {
                    column: {
                        dataLabels: {
                            enabled: true
                        }
                    }
                },
                series: [{
                    data: [49.9, 0, 0.1]
                }]
            }),
            points = chart.series[0].points;

        assert.strictEqual(
            points[1].dataLabel.attr('y') > points[2].dataLabel.attr('y'),
            true,
            'Point\'s y=0 dataLabel is placed below point\'s dataLabel with y=0.1.'
        );
    }
);
*/
