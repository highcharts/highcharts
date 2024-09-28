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

QUnit.test('General marker-clusters', function (assert) {
    var chart = Highcharts.chart('container', options),
        series = chart.series[0],
        clusterOptions = series.options.cluster,
        posX = 0,
        posY = 0,
        cluster,
        clusters,
        result,
        resultparentIds,
        resultPosition,
        resultVisibility,
        oldStateKeys,
        id,
        newPoint,
        oldPoint,
        newX,
        oldX,
        newY,
        oldY;

    series.update({
        cluster: {
            minimumClusterSize: 3,
            layoutAlgorithm: {
                type: 'grid',
                gridSize: 50
            }
        }
    });

    result = true;

    series.markerClusterInfo.clusters.forEach(function (cluster) {
        if (cluster.data.length < clusterOptions.minimumClusterSize) {
            result = false;
        }
    });

    assert.ok(
        result,
        'Cluster data size should be greater or equal minimumClusterSize.'
    );

    series.update({
        cluster: {
            minimumClusterSize: 2,
            marker: {
                radius: 18
            }
        }
    });

    cluster = series.markerClusterInfo.clusters[0];
    cluster.data.forEach(function (p) {
        posX += p.x;
        posY += p.y;
    });

    assert.deepEqual(
        [cluster.x, cluster.y],
        [posX / cluster.data.length, posY / cluster.data.length],
        'Cluster position should be an average of clustered points.'
    );

    assert.strictEqual(
        +(cluster.point.graphic.getBBox().width / 2).toFixed(2),
        18,
        'Cluster marker size should be two times bigger than radius.'
    );

    series.update({
        cluster: {
            zones: [
                {
                    from: 1,
                    to: 2,
                    marker: {
                        fillColor: '#25b35b',
                        radius: 13
                    }
                },
                {
                    from: 3,
                    to: 4,
                    marker: {
                        fillColor: '#ff9603',
                        radius: 15
                    }
                },
                {
                    from: 4,
                    to: 5,
                    marker: {
                        fillColor: '#ff5500',
                        radius: 18
                    }
                },
                {
                    from: 6,
                    to: 10,
                    marker: {
                        fillColor: '#fc1100',
                        className: 'test-class-name',
                        radius: 18
                    }
                }
            ]
        }
    });

    clusters = series.markerClusterInfo.clusters;
    assert.deepEqual(
        [
            clusters[2].point.graphic.fillColor,
            clusters[1].point.graphic.fillColor,
            clusters[0].point.graphic.fillColor,
            clusters[2].point.graphic.radius,
            clusters[1].point.graphic.radius,
            clusters[0].point.graphic.radius
        ],
        ['#ff9603', '#25b35b', '#ff5500', 15, 13, 18],
        'Clusters should have zones applied properly.'
    );

    clusters[0].point.onMouseOver();

    assert.strictEqual(
        chart.tooltip.label.text.element.textContent,
        'Cluster size: ' + clusters[0].data.length,
        'Clusters tooltip format should be consistent with ' +
        'tooltip.clusterFormat.'
    );

    series.markerClusterInfo.noise[0].point.onMouseOver();

    assert.strictEqual(
        chart.tooltip.label.text.element.textContent,
        'value: ' + series.markerClusterInfo.noise[0].point.y,
        'Noise tooltip format should be consistent with tooltip.pointFormat.'
    );

    series.addPoint({
        x: -785,
        y: 617
    });

    assert.strictEqual(
        series.markerClusterInfo.clusters[3].data.length,
        5,
        'After addPoint() cluster size should be updated.'
    );

    series.addPoint({
        x: -784,
        y: 618
    });

    assert.deepEqual(
        [
            series.markerClusterInfo.clusters[3].clusterZone,
            series.markerClusterInfo.clusters[3].point.graphic.fillColor
        ],
        [
            series.options.cluster.zones[3],
            series.options.cluster.zones[3].marker.fillColor
        ],
        'After addPoint() cluster zone should be updated.'
    );

    assert.strictEqual(
        series.markerClusterInfo.clusters[3].point.graphic.className,
        'test-class-name',
        'Cluster class name should be consistent with zone.className.'
    );

    series.markerClusterInfo.clusters[3].point.firePointEvent('click');

    assert.deepEqual(
        [
            series.xAxis.min,
            series.xAxis.max,
            series.yAxis.min,
            series.yAxis.max
        ].map(Math.round),
        [-789, -777, 616, 620],
        'After click on cluster chart should be zoomed to the cluster data ' +
        'range.'
    );

    chart.zoomOut();

    assert.strictEqual(
        series.markerClusterInfo.pointsState,
        undefined,
        'When animation is disabled pointsState should not be defined.'
    );

    // Animation tests.
    series.update({
        cluster: {
            animation: {
                duration: 1
            }
        }
    });

    series.markerClusterInfo.clusters[3].point.firePointEvent('click');

    assert.deepEqual(
        Object.keys(series.markerClusterInfo.pointsState),
        ['oldState', 'newState'],
        'When animation is enabled pointsState should have old and new state ' +
        'props.'
    );

    oldStateKeys = Object.keys(series.markerClusterInfo.pointsState.oldState);
    resultparentIds = true;
    resultPosition = true;
    resultVisibility = true;

    Highcharts.objectEach(
        series.markerClusterInfo.pointsState.newState,
        function (state) {
            id = state.parentsId[0];

            if (!oldStateKeys.includes(id)) {
                resultparentIds = false;
            }

            newPoint = state.point;
            oldPoint = series.markerClusterInfo.pointsState.oldState[id].point;

            newX = newPoint.graphic.x + newPoint.graphic.radius;
            oldX = oldPoint.plotX;
            newY = newPoint.graphic.y + newPoint.graphic.radius;
            oldY = oldPoint.plotY;

            if (
                newX &&
                newY &&
                oldX &&
                oldY &&
                (newX.toFixed(4) !== oldX.toFixed(4) ||
                    newY.toFixed(4) !== oldY.toFixed(4))
            ) {
                resultPosition = false;
            }

            if (oldPoint.graphic && oldPoint.graphic.visibility !== 'hidden') {
                resultVisibility = false;
            }
        }
    );

    assert.ok(
        resultparentIds,
        'New state parentIds values should be a part of old state object keys.'
    );

    assert.ok(
        resultPosition,
        'Points graphic should be translated to the parent point position ' +
        'before animation.'
    );

    assert.ok(
        resultVisibility,
        'Parent point should be hidden before animation.'
    );

    // (#13981)
    chart = Highcharts.chart('container', {
        series: [
            {
                cluster: {
                    enabled: true
                },
                type: 'scatter',
                data: []
            }
        ]
    });

    assert.ok(
        !chart.series[0].markerClusterInfo,
        'Marker clusters should not be generated when a series has empty ' +
        'data (#13981).'
    );

    // (#13302)
    var done = assert.async(),
        url =
            location.host.substr(0, 12) === 'localhost:98' ?
                'url(base/test/testimage.png)' : // karma
                'url(testimage.png)'; // utils

    chart = Highcharts.chart('container', {
        chart: {
            events: {
                load: function () {
                    var chart = this,
                        oldPointClicked = false,
                        point,
                        graphicBBox,
                        oldPoint,
                        oldPointPlotX,
                        oldPointPlotY,
                        isAnimationCorrect;

                    chart.xAxis[0].setExtremes(49, 52);

                    point = chart.series[0].points[0];
                    graphicBBox = point.graphic.getBBox();

                    result = true;

                    if (
                        Math.abs(point.plotX - graphicBBox.x) > 1 &&
                        Math.abs(point.plotY - graphicBBox.y) > 1
                    ) {
                        result = false;
                    }

                    assert.ok(
                        result,
                        'Points with image marker symbol should be displayed ' +
                            'correctly after the zoom (#13302).'
                    );

                    // Check points position before animation.
                    Highcharts.wrap(
                        Highcharts.Series.types.scatter.prototype,
                        'animateClusterPoint',
                        function (proceed) {
                            var p = arguments[1].point;

                            if (oldPoint) {
                                oldPoint.plotX = oldPointPlotX;
                                oldPoint.plotY = oldPointPlotY;
                            }

                            proceed.apply(
                                this,
                                Array.prototype.slice.call(arguments, 1)
                            );

                            if (
                                oldPointClicked &&
                                Math.abs(oldPointPlotX - p.graphic.attr('x')) >
                                    1 &&
                                Math.abs(oldPointPlotY - p.graphic.attr('y')) >
                                    1
                            ) {
                                isAnimationCorrect = false;
                            }
                        }
                    );

                    Highcharts.addEvent(chart, 'render', function () {
                        if (oldPointClicked) {
                            oldPointClicked = false;

                            assert.ok(
                                isAnimationCorrect,
                                'Image markers animation should start from ' +
                                'the ' +
                                    'old cluster position (#14342).'
                            );

                            done();
                        }
                    });

                    chart.xAxis[0].setExtremes(0, 100);
                    chart.series[0].update({
                        cluster: {
                            animation: {
                                duration: 1
                            }
                        }
                    });

                    oldPoint = chart.series[0].points[0];
                    oldPointPlotX = oldPoint.plotX;
                    oldPointPlotY = oldPoint.plotY;
                    oldPointClicked = true;
                    isAnimationCorrect = true;
                    oldPoint.firePointEvent('click');
                }
            }
        },
        plotOptions: {
            series: {
                cluster: {
                    enabled: true
                }
            }
        },
        series: [
            {
                type: 'scatter',
                marker: {
                    symbol: url.replace(')', '?' + Date.now() + ')')
                },
                animation: {
                    duration: 0
                },
                cluster: {
                    animation: {
                        duration: 0
                    }
                },
                data: [
                    [0, 0],
                    [50, 50],
                    [55, 53],
                    [52, 51],
                    [100, 100]
                ]
            }
        ]
    });
});

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

    assert.deepEqual(
        [
            series.markerClusterInfo.clusters.length,
            series.markerClusterInfo.noise.length,
            clusteredPointsLen
        ],
        [4, 6, series.xData.length],
        'Cluster and noise amount should be correct.'
        // The correct is what looks good in the chart - the magic numbers
        // are emirical values.
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

    for (i = 0; i < series.xData.length; i++) {
        pointClusterDistance = [];
        pointX = series.xData[i];
        pointY = series.yData[i];

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
        series.xData,
        series.yData,
        [],
        { processedDistance: maxDistance }
    );
    series.markerClusterInfo = null;

    groupedPointsOKM = series.markerClusterAlgorithms.optimizedKmeans.call(
        series,
        series.xData,
        series.yData,
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

    groupedPointsKM = series.markerClusterAlgorithms.kmeans.call(
        series,
        series.xData,
        series.yData,
        [],
        { processedDistance: maxDistance }
    );

    groupedPointsOKM = series.markerClusterAlgorithms.optimizedKmeans.call(
        series,
        series.xData,
        series.yData,
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
        series.xData,
        series.yData,
        [],
        { processedDistance: maxDistance }
    );

    groupedPointsOKM = series.markerClusterAlgorithms.optimizedKmeans.call(
        series,
        series.xData,
        series.yData,
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
