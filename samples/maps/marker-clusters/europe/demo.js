Highcharts.getJSON('https://cdn.jsdelivr.net/gh/highcharts/highcharts@1e9e659c2d60fbe27ef0b41e2f93112dd68fb7a3/samples/data/european-train-stations-near-airports.json', function (data) {
    Highcharts.mapChart('container', {
        chart: {
            map: 'custom/europe'
        },
        title: {
            text: 'European Train Stations Near Airports'
        },
        subtitle: {
            text: 'Data source: https://github.com/trainline-eu/stations'
        },
        mapNavigation: {
            enabled: true
        },
        tooltip: {
            headerFormat: '',
            pointFormat: '<b>{point.name}</b><br>Lat: {point.lat:.2f}, Lon: {point.lon:.2f}'
        },
        colorAxis: {
            min: 0,
            max: 20
        },
        plotOptions: {
            mappoint: {
                cluster: {
                    enabled: true,
                    allowOverlap: false,
                    animation: {
                        duration: 450
                    },
                    layoutAlgorithm: {
                        type: 'grid',
                        gridSize: 70
                    },
                    zones: [{
                        from: 1,
                        to: 4,
                        marker: {
                            radius: 13
                        }
                    }, {
                        from: 5,
                        to: 9,
                        marker: {
                            radius: 15
                        }
                    }, {
                        from: 10,
                        to: 15,
                        marker: {
                            radius: 17
                        }
                    }, {
                        from: 16,
                        to: 20,
                        marker: {
                            radius: 19
                        }
                    }, {
                        from: 21,
                        to: 100,
                        marker: {
                            radius: 21
                        }
                    }]
                }
            }
        },
        series: [{
            name: 'Basemap',
            borderColor: '#A0A0A0',
            nullColor: 'rgba(200, 200, 200, 0.3)',
            showInLegend: false
        }, {
            type: 'mappoint',
            enableMouseTracking: true,
            colorKey: 'clusterPointsAmount',
            name: 'Cities',
            color: Highcharts.getOptions().colors[1],
            data: data
        }]
    });
});
