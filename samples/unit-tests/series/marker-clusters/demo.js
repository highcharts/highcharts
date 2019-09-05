QUnit.test('General marker-clusters', function (assert) {
    var chart = Highcharts.chart('container', {
            chart: {
                width: 500
            },
            plotOptions: {
                scatter: {
                    tooltip: {
                        headerFormat: '',
                        pointFormat: 'value: {point.y}',
                        clusterFormat: 'Cluster size: {point.clusteredDataLen}'
                    },
                    dataLabels: {
                        enabled: true
                    },
                    marker: {
                        cluster: {
                            enabled: true,
                            layoutAlgorithm: {
                                type: 'grid',
                                gridSize: 50
                            },
                            dataLabels: {
                                enabled: true,
                                format: '{point.clusteredDataLen}',
                                verticalAlign: 'middle',
                                align: 'center',
                                style: {
                                    fontSize: '9px'
                                }
                            }
                        }
                    }
                }
            },
            series: [{
                type: 'scatter',
                data: [{
                    x: 751,
                    y: 356
                }, {
                    x: 573,
                    y: 285
                }, {
                    x: 427,
                    y: 339
                }, {
                    x: 775,
                    y: 578
                }, {
                    x: 770,
                    y: 570
                }, {
                    x: 780,
                    y: 560
                }, {
                    x: 785,
                    y: 580
                }, {
                    x: 770,
                    y: 550
                }, {
                    x: 740,
                    y: 520
                }, {
                    x: 710,
                    y: 538
                }, {
                    x: 720,
                    y: 540
                }, {
                    x: 710,
                    y: 630
                }, {
                    x: 715,
                    y: 670
                }, {
                    x: 720,
                    y: 620
                }, {
                    x: 740,
                    y: 616
                }, {
                    x: 788,
                    y: 620
                }, {
                    x: 780,
                    y: 616
                }, {
                    x: 778,
                    y: 618
                }, {
                    x: 783,
                    y: 617
                }]
            }]
        }),
        series = chart.series[0],
        clusteredPointsLen = series.clusters.noise.length,
        clusterOptions = series.options.marker.cluster,
        xAxis = chart.xAxis[0],
        yAxis = chart.yAxis[0],
        cluster,
        nextCluster,
        posX = 0,
        posY = 0,
        distance,
        clusters,
        result,
        key,
        i;

    for (i = 0; i < series.clusters.clusters.length; i++) {
        clusteredPointsLen += series.clusters.clusters[i].data.length;
    }

    assert.deepEqual(
        [
            series.clusters.clusters.length,
            series.clusters.noise.length,
            clusteredPointsLen
        ],
        [
            5,
            5,
            series.xData.length
        ],
        'Cluster and noise amount should be correct.'
    );

    cluster = series.clusters.clusters[0];

    cluster.data.forEach(function (p) {
        posX += p.x;
        posY += p.y;
    });

    assert.deepEqual(
        [cluster.x, cluster.y],
        [posX / cluster.data.length, posY / cluster.data.length],
        'Cluster position should be an average of clustered points.'
    );

    key = Math.floor((yAxis.toPixels(cluster.y) - chart.plotTop) / clusterOptions.layoutAlgorithm.gridSize) +
      '-' +
      Math.floor((xAxis.toPixels(cluster.x) - chart.plotLeft) / clusterOptions.layoutAlgorithm.gridSize);

    assert.strictEqual(
        cluster.id,
        key,
        'Cluster grid id should be correct.'
    );

    series.update({
        marker: {
            cluster: {
                minimumClusterSize: 3
            }
        }
    });

    result = true;

    series.clusters.clusters.forEach(function (cluster) {
        if (cluster.data.length < clusterOptions.minimumClusterSize) {
            result = false;
        }
    });

    assert.ok(result, 'Cluster data size should be greater or equal minimumClusterSize.');

    series.update({
        marker: {
            cluster: {
                minimumClusterSize: 2,
                style: {
                    radius: 18
                }
            }
        }
    });

    cluster = series.clusters.clusters[0];

    assert.strictEqual(
        +(cluster.point.graphic.getBBox().width / 2).toFixed(2),
        18,
        'Cluster marker size should be two times bigger than radius.'
    );

    series.update({
        marker: {
            cluster: {
                allowOverlap: false
            }
        }
    });

    cluster = series.clusters.clusters[0];
    nextCluster = series.clusters.clusters[1];

    distance = Math.sqrt(
        Math.pow(cluster.point.plotX - nextCluster.point.plotX, 2) +
        Math.pow(cluster.point.plotY - nextCluster.point.plotY, 2)
    );

    assert.ok(
        distance >= series.options.marker.cluster.style.radius * 2,
        'Clusters should not overlap.'
    );

    series.update({
        marker: {
            cluster: {
                zones: [{
                    from: 1,
                    to: 2,
                    style: {
                        fillColor: '#25b35b',
                        radius: 13
                    }
                }, {
                    from: 3,
                    to: 4,
                    style: {
                        fillColor: '#ff9603',
                        radius: 15
                    }
                }, {
                    from: 4,
                    to: 5,
                    style: {
                        fillColor: '#ff5500',
                        radius: 18
                    }
                }, {
                    from: 6,
                    to: 10,
                    style: {
                        fillColor: '#fc1100',
                        className: 'test-class-name',
                        radius: 18
                    }
                }]
            }
        }
    });

    clusters = series.clusters.clusters;

    assert.deepEqual(
        [
            clusters[0].point.graphic.fillColor,
            clusters[1].point.graphic.fillColor,
            clusters[4].point.graphic.fillColor,
            clusters[0].point.graphic.radius,
            clusters[1].point.graphic.radius,
            clusters[4].point.graphic.radius
        ],
        ['#ff9603', '#25b35b', '#ff5500', 15, 13, 18],
        'Clusters should have zones applied properly.'
    );

    clusters[0].point.onMouseOver();

    assert.strictEqual(
        chart.tooltip.label.text.element.textContent,
        'Cluster size: 3',
        'Clusters tooltip format should be consistent with tooltip.clusterFormat.'
    );

    series.clusters.noise[0].point.onMouseOver();

    assert.strictEqual(
        chart.tooltip.label.text.element.textContent,
        'value: 356',
        'Noise tooltip format should be consistent with tooltip.pointFormat.'
    );

    series.addPoint({
        x: 785,
        y: 614
    });

    assert.strictEqual(
        series.clusters.clusters[4].data.length,
        5,
        'After addPoint() cluster size should be updated.'
    );

    series.addPoint({
        x: 782,
        y: 615
    });

    assert.deepEqual(
        [
            series.clusters.clusters[4].clusterZone,
            series.clusters.clusters[4].point.graphic.fillColor
        ],
        [
            series.options.marker.cluster.zones[3],
            series.options.marker.cluster.zones[3].style.fillColor
        ],
        'After addPoint() cluster zone should be updated.'
    );

    assert.strictEqual(
        series.clusters.clusters[4].point.graphic.className,
        'test-class-name',
        'Cluster class name should be consistent with zone.className.'
    );

    series.clusters.clusters[4].point.firePointEvent('click');

    assert.deepEqual(
        [
            series.xAxis.min,
            series.xAxis.max,
            series.yAxis.min,
            series.yAxis.max
        ],
        [
            777,
            788,
            612,
            622
        ],
        'After click on cluster chart should be zoomed to the cluster data range.'
    );

    chart.zoomOut();
});
