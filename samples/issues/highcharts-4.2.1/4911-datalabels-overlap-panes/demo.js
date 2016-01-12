
$(function () {
    QUnit.test('False detection of overlapping labels in different panes', function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            yAxis: [{
                "height": "50%",
                "top": "50%"
            }, {
                "height": "50%",
                "top": "0%"
            }],
            series: [{
                data: [1, 2, 3]
            }, {
                yAxis: 1,
                data: [1, 2, 3]
            }],
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        allowOverlap: false
                    }
                }
            }
        });

        chart.series.forEach(function (series) {
            series.points.forEach(function (point) {
                assert.strictEqual(
                    point.dataLabel.attr('opacity'),
                    1,
                    'Data label is visible'
                );
            });
        });
    });
});