$.get(
    "https://raw.githubusercontent.com/trainline-eu/stations/master/stations.csv",
    csv => {
        const parsedData = window.Papa.parse(csv);
        const data = parsedData.data
            .filter(elem =>
                elem[13] === 't' &&
                elem[12] === 't' &&
                elem[5] &&
                elem[6] &&
                elem[1] !== 'Funchal Madeira Airport'
            )
            .map(elem => ({
                name: elem[1].replace(' Airport', '').replace(' Aeroporto', ''),
                lat: +elem[5],
                lon: +elem[6],
                country: elem[8]
            }));


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
                formatter: function () {
                    const point = this.point;

                    if (point.isCluster) {
                        return `Stations nearby: ${point.clusterPointsAmount}`;
                    }

                    return `<b>${point.name}</b><br>Lat: ${point.lat.toFixed(2)},
                        Lon: ${point.lon.toFixed(2)}`;
                }
            },
            colorAxis: {
                min: 0,
                max: 15
            },
            plotOptions: {
                mappoint: {
                    cluster: {
                        enabled: true,
                        layoutAlgorithm: {
                            type: 'kmeans',
                            distance: 50
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
                            to: 25,
                            marker: {
                                radius: 17
                            }
                        }, {
                            from: 16,
                            to: 20,
                            marker: {
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
                colorKey: 'clusterPointsAmount',
                name: 'Cities',
                color: Highcharts.getOptions().colors[1],
                data: data
            }]
        });
    }
);