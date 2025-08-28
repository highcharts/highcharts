var options = {
    chart: {
        width: 500
    },
    title: {
        text: ''
    },
    plotOptions: {
        scatter: {
            tooltip: {
                headerFormat: '',
                pointFormat: 'value: {point.y}',
                clusterFormat: 'Cluster size: {point.clusterPointsAmount}'
            },
            dataLabels: {
                enabled: true
            },
            cluster: {
                enabled: true,
                animation: false,
                layoutAlgorithm: {
                    type: 'grid'
                },
                dataLabels: {
                    enabled: true,
                    format: '{point.clusterPointsAmount}',
                    verticalAlign: 'middle',
                    align: 'center',
                    marker: {
                        fontSize: '9px'
                    }
                }
            }
        }
    },
    series: [
        {
            type: 'scatter',
            data: [
                {
                    x: -751,
                    y: 356
                },
                {
                    x: -573,
                    y: 285
                },
                {
                    x: -427,
                    y: 339
                },
                {
                    x: -775,
                    y: 578
                },
                {
                    x: -770,
                    y: 570
                },
                {
                    x: -780,
                    y: 560
                },
                {
                    x: -785,
                    y: 580
                },
                {
                    x: -770,
                    y: 550
                },
                {
                    x: -740,
                    y: 520
                },
                {
                    x: -710,
                    y: 538
                },
                {
                    x: -720,
                    y: 540
                },
                {
                    x: -710,
                    y: 630
                },
                {
                    x: -715,
                    y: 670
                },
                {
                    x: -720,
                    y: 620
                },
                {
                    x: -740,
                    y: 616
                },
                {
                    x: -788,
                    y: 620
                },
                {
                    x: -780,
                    y: 616
                },
                {
                    x: -778,
                    y: 618
                },
                {
                    x: -783,
                    y: 617
                },
                {
                    x: -880,
                    y: 451
                }
            ]
        }
    ]
};

QUnit.test('Grid algorithm tests.', function (assert) {
    var chart = Highcharts.chart('container', options),
        series = chart.series[0],
        xAxis = chart.xAxis[0],
        yAxis = chart.yAxis[0],
        cluster,
        clusteredPointsLen,
        clusterOptions,
        gridOffset,
        distance,
        result,
        key,
        i;

    series.update({
        cluster: {
            layoutAlgorithm: {
                type: 'grid',
                gridSize: 50
            }
        }
    });

    clusteredPointsLen = series.markerClusterInfo.noise.length;
    clusterOptions = series.options.cluster;

    for (i = 0; i < series.markerClusterInfo.clusters.length; i++) {
        clusteredPointsLen += series.markerClusterInfo.clusters[i].data.length;
    }

    // Fixing tip: the 2 below checks are based on what looks good in the chart.
    assert.ok(
        Highcharts.clamp(series.markerClusterInfo.clusters.length, 3, 4) ===
            series.markerClusterInfo.clusters.length,
        'Cluster amount should look good.'
    );
    assert.ok(
        Highcharts.clamp(series.markerClusterInfo.noise.length, 4, 6) ===
            series.markerClusterInfo.noise.length,
        'Noise amount should look good.'
    );

    assert.strictEqual(
        clusteredPointsLen,
        series.dataTable.rowCount,
        'Clustered points size should be the same as the input data.'
    );

    cluster = series.markerClusterInfo.clusters[0];
    gridOffset = series.getGridOffset();

    assert.deepEqual(
        [xAxis.toPixels(xAxis.dataMin), yAxis.toPixels(yAxis.dataMax)],
        [gridOffset.plotLeft, gridOffset.plotTop],
        'getGridOffset() should return correct plot values.'
    );

    key =
        Math.floor(
            (yAxis.toPixels(cluster.y) - gridOffset.plotTop) /
                clusterOptions.layoutAlgorithm.gridSize
        ) +
        ':' +
        Math.floor(
            (xAxis.toPixels(cluster.x) - gridOffset.plotLeft) /
                clusterOptions.layoutAlgorithm.gridSize
        );

    assert.strictEqual(cluster.id, key, 'Cluster grid id should be correct.');

    series.update({
        cluster: {
            allowOverlap: false
        }
    });

    result = true;

    series.markerClusterInfo.clusters.forEach(function (cluster, i) {
        if (result) {
            series.markerClusterInfo.clusters.forEach(function (
                nextCluster,
                j
            ) {
                if (i !== j && result) {
                    distance = Math.sqrt(
                        Math.pow(
                            cluster.point.plotX - nextCluster.point.plotX,
                            2
                        ) +
                            Math.pow(
                                cluster.point.plotY - nextCluster.point.plotY,
                                2
                            )
                    );

                    if (
                        distance <
                        cluster.point.graphic.radius +
                            nextCluster.point.graphic.radius
                    ) {
                        result = false;
                    }
                }
            });
        }
    });

    assert.ok(result, 'Clusters should not overlap when allowOverlap = false.');
});

QUnit.test('Kmeans algorithm tests.', function (assert) {
    var chart = Highcharts.chart('container', options),
        series = chart.series[0],
        xAxis = chart.xAxis[0],
        yAxis = chart.yAxis[0],
        maxDistance = 40,
        clustersTest = [],
        noiseTest = [],
        pointClusterDistance = [],
        pointX,
        pointY,
        distance,
        clusters,
        result,
        i;

    series.update({
        cluster: {
            layoutAlgorithm: {
                type: 'kmeans',
                distance: maxDistance
            }
        }
    });

    clusters = series.markerClusterInfo.clusters;

    const xData = series.getColumn('x'),
        yData = series.getColumn('y');
    for (i = 0; i < xData.length; i++) {
        pointClusterDistance = [];
        pointX = xData[i];
        pointY = yData[i];

        for (var j = 0; j < clusters.length; j++) {
            distance = Math.sqrt(
                Math.pow(
                    xAxis.toPixels(pointX) - xAxis.toPixels(clusters[j].x),
                    2
                ) +
                    Math.pow(
                        yAxis.toPixels(pointY) - yAxis.toPixels(clusters[j].y),
                        2
                    )
            );

            pointClusterDistance.push({
                clusterIndex: j,
                distance: distance
            });
        }

        pointClusterDistance.sort((a, b) => a.distance - b.distance);

        if (
            pointClusterDistance.length &&
            pointClusterDistance[0].distance < maxDistance
        ) {
            if (!clustersTest[pointClusterDistance[0].clusterIndex]) {
                clustersTest[pointClusterDistance[0].clusterIndex] = [];
            }

            clustersTest[pointClusterDistance[0].clusterIndex].push({
                x: pointX,
                y: pointY
            });
        } else {
            noiseTest.push({
                x: pointX,
                y: pointY
            });
        }
    }

    result = true;

    clustersTest.forEach(function (cluster, index) {
        if (cluster.length !== clusters[index].data.length) {
            result = false;
        }
    });

    assert.ok(
        result,
        'Clusters should have only points that are spaced closer than the ' +
        'distance set by a user.'
    );

    assert.strictEqual(
        noiseTest.length,
        series.markerClusterInfo.noise.length,
        'Noise points amount should be correct.'
    );
});

QUnit.test('OptimizedKmeans algorithm tests.', function (assert) {
    var chart = Highcharts.chart('container', options),
        series = chart.series[0],
        xAxis = chart.xAxis[0],
        yAxis = chart.yAxis[0],
        maxDistance = 50,
        groupedPointsKM = [],
        groupedPointsOKM = [];

    xAxis.setExtremes(600, 800, false);
    yAxis.setExtremes(500, 700, false);
    chart.redraw();

    groupedPointsKM = series.markerClusterAlgorithms.kmeans.call(
        series,
        series.getColumn('x'),
        series.getColumn('y'),
        [],
        { processedDistance: maxDistance }
    );
    series.markerClusterInfo = null;

    groupedPointsOKM = series.markerClusterAlgorithms.optimizedKmeans.call(
        series,
        series.getColumn('x'),
        series.getColumn('y'),
        [],
        { processedDistance: maxDistance }
    );

    assert.deepEqual(
        groupedPointsKM,
        groupedPointsOKM,
        'optimizedKmeans should use kmeans on initialization.'
    );

    xAxis.setExtremes(650, 800, false);
    yAxis.setExtremes(530, 700, false);
    chart.redraw();

    const xData = series.getColumn('x'),
        yData = series.getColumn('y');
    groupedPointsKM = series.markerClusterAlgorithms.kmeans.call(
        series,
        xData,
        yData,
        [],
        { processedDistance: maxDistance }
    );

    groupedPointsOKM = series.markerClusterAlgorithms.optimizedKmeans.call(
        series,
        xData,
        yData,
        [],
        { processedDistance: maxDistance }
    );

    assert.notDeepEqual(
        groupedPointsKM,
        groupedPointsOKM,
        'optimizedKmeans should not use kmeans when extremes range is ' +
        'smaller than on chart init.'
    );

    xAxis.setExtremes(250, 800, false);
    yAxis.setExtremes(250, 800, false);
    chart.redraw();

    groupedPointsKM = series.markerClusterAlgorithms.kmeans.call(
        series,
        xData,
        yData,
        [],
        { processedDistance: maxDistance }
    );

    groupedPointsOKM = series.markerClusterAlgorithms.optimizedKmeans.call(
        series,
        xData,
        yData,
        [],
        { processedDistance: maxDistance }
    );

    assert.deepEqual(
        groupedPointsKM,
        groupedPointsOKM,
        'optimizedKmeans should use kmeans again when extremes range is ' +
        'greater than on chart init.'
    );
});
