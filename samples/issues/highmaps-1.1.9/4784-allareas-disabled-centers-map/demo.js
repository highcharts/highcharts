$(function () {
    QUnit.test('Map with allAreas disabled centers on visible areas.', function (assert) {
        var chart = $('#container').highcharts('Map', {
            series : [{
                data: [{
                    "hc-key": "gb-hi",
                    "value": 2
                }],
                mapData: Highcharts.maps['custom/british-isles-all'],
                joinBy: 'hc-key',
                allAreas: false
            }]
        }).highcharts();

        assert.ok(Math.abs(chart.series[0].points[0].graphic.getBBox().height - chart.plotHeight) < 2,
                'Height of point bBox equals plotHeight');

        chart.series[0].update({
            allAreas: true
        });

        assert.ok(Math.abs(chart.series[0].points[0].graphic.getBBox().height - chart.plotHeight) > 2,
                'Height of point bBox no longer equals plotHeight');
    });
});