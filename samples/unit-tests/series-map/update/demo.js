QUnit.test('Chart update with map', assert => {
    const options1 = {
        chart: {
            map: 'custom/europe',
            borderWidth: 1
        },

        series: [{
            data: [
                ['is', 1],
                ['no', 1],
                ['se', 1]
            ]
        }, {
            type: 'mappoint',
            cluster: {
                enabled: true
            },
            keys: ['x', 'y'],
            data: [
                [0, 0],
                [0, 0]
            ]
        }]
    };

    const options2 = {
        series: [
            {
                data: [['is', 1]]
            }
        ]
    };

    const chart = Highcharts.mapChart('container', options1);

    const getAttribs = attr => ({
        iceland: chart.container
            .querySelector('.highcharts-key-is')
            .getAttribute(attr),
        norway: chart.container
            .querySelector('.highcharts-key-no')
            .getAttribute(attr),
        germany: chart.container
            .querySelector('.highcharts-key-de')
            .getAttribute(attr)
    });

    const originalPaths = getAttribs('d');

    assert.deepEqual(
        getAttribs('fill'),
        {
            germany: '#f7f7f7',
            iceland: Highcharts.getOptions().colors[0],
            norway: Highcharts.getOptions().colors[0]
        },
        'Fill colors should reflect data'
    );

    chart.series[1].markerClusterInfo.clusters[0].point.firePointEvent('click');

    assert.ok(
        true,
        'Click on cluster of same location points should not throw (#17205).'
    );

    chart.update({
        mapView: {
            maxZoom: 10
        }
    });

    const scaleBeforeZoom = chart.mapView.getScale();
    chart.series[1].markerClusterInfo.clusters[0].point.firePointEvent('click');

    assert.notEqual(
        scaleBeforeZoom,
        chart.mapView.getScale(),
        'A cluster should be zoomed after click if mapView.maxZoom is set.'
    );

    assert.ok(
        chart.series[1].markerClusterInfo.clusters.length,
        'A cluster of same location points should remain a cluster after zoom.'
    );
    chart.zoomOut();

    chart.update(options2);

    assert.deepEqual(
        getAttribs('d'),
        originalPaths,
        'Paths should stay fixed when data values change'
    );

    assert.deepEqual(
        getAttribs('fill'),
        {
            germany: '#f7f7f7',
            iceland: Highcharts.getOptions().colors[0],
            norway: '#f7f7f7'
        },
        'Fill colors should reflect data'
    );
});
