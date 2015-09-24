
$(function () {
    QUnit.test('Zoom into the point with unsorted data should calculate properly extremes.', function (assert) {
        var chart = $('#container').highcharts({
            chart: {
                zoomType: 'xy'
            },
            xAxis: {
                startOnTick: true
            },
            series: [{
                type: "scatter",
                  data: [[161.2, 51.6], [147.2, 49.8],[164.0, 53.8], [160.9, 54.4]]
            }]  
        }).highcharts();

        // easiest case: zoom-in twice:
        chart.zoom({
            yAxis: [{
                min: 49,
                max: 50,
                axis: chart.yAxis[0]
            }],
            xAxis: [{
                min: 147,
                max: 148,
                axis: chart.xAxis[0]
            }]
        });

        chart.zoom({
            yAxis: [{
                min: 49.5,
                max: 49.9,
                axis: chart.yAxis[0]
            }],
            xAxis: [{
                min: 147.1,
                max: 147.3,
                axis: chart.xAxis[0]
            }]
        });

        assert.strictEqual(
            isNaN(chart.series[0].points[0].plotY),
            false,
            'Point within visible range.'
        );
    });
});