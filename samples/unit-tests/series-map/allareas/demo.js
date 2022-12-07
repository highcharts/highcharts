QUnit.test(
    'Map with allAreas disabled centers on visible areas (#4784)',
    assert => {

        let chart;

        const getRenderedHeight = () => Math.abs(
            chart.series[0].points[0].graphic.getBBox().height *
            chart.mapView.getSVGTransform().scaleY
        );

        chart = Highcharts.mapChart('container', {
            series: [
                {
                    data: [['gb-hi', 2]],
                    mapData: Highcharts.maps['custom/british-isles-all'],
                    allAreas: false
                }
            ]
        });

        assert.close(
            getRenderedHeight(),
            chart.plotHeight,
            2,
            'Height of point bBox should equal plotHeight'
        );

        chart = Highcharts.mapChart('container', {
            series: [
                {
                    data: [['gb-hi', 2]],
                    mapData: Highcharts.maps['custom/british-isles-all'],
                    allAreas: true
                }
            ]
        });

        assert.ok(
            Math.abs(getRenderedHeight() - chart.plotHeight) > 2,
            'Height of point bBox should no longer equal plotHeight'
        );
    }
);
