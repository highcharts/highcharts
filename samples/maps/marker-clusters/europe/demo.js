Highcharts.getJSON('http://utils.highcharts.local/samples/data/european-train-stations-near-airports.json', function (data) {
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
            pointFormat: '<b>{point.name}</b><br>Lat: {point.lat}, Lon: {point.lon}'
        },
        colorAxis: {
            min: 0,
            max: 15
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
                        gridSize: 60
                    },
                    zones: [{
                        from: 1,
                        to: 4,
                        style: {
                            radius: 13
                        }
                    }, {
                        from: 5,
                        to: 9,
                        style: {
                            radius: 15
                        }
                    }, {
                        from: 10,
                        to: 25,
                        style: {
                            radius: 17
                        }
                    }, {
                        from: 16,
                        to: 20,
                        style: {
                            radius: 19
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
