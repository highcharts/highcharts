QUnit.test('Map with allAreas disabled centers on visible areas (#4784)', assert => {
    let chart;

    chart = Highcharts.mapChart('container', {
        series: [{
            data: [['gb-hi', 2]],
            mapData: Highcharts.maps['custom/british-isles-all'],
            allAreas: false
        }]
    });

    assert.close(
        chart.series[0].points[0].graphic.getBBox().height,
        chart.plotHeight,
        2,
        'Height of point bBox equals plotHeight'
    );

    chart = Highcharts.mapChart('container', {
        series: [{
            data: [['gb-hi', 2]],
            mapData: Highcharts.maps['custom/british-isles-all'],
            allAreas: true
        }]
    });

    assert.ok(
        Math.abs(
            chart.series[0].points[0].graphic.getBBox().height -
            chart.plotHeight
        ) > 2,
        'Height of point bBox no longer equals plotHeight'
    );
});
