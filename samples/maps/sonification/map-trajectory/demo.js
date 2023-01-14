(async () => {
    // Load map
    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/north-america.topo.json'
    ).then(response => response.json());


    // Map configuration
    const chart = Highcharts.mapChart('container', {
        chart: {
            map: topology
        },

        title: {
            text: 'Sonifying trajectories'
        },

        sonification: {
            duration: 10000
        },

        mapView: {
            center: [-80, 35],
            zoom: 4
        },

        legend: {
            enabled: false
        },

        tooltip: {
            pointFormat: 'Lat: {point.lat}<br>Lon: {point.lon}'
        },

        plotOptions: {
            mappoint: {
                keys: ['lon', 'lat', 'custom.label'],
                lineWidth: 2,
                marker: {
                    enabled: false,
                    radius: 2
                },
                dataLabels: {
                    enabled: true,
                    format: '{point.options.custom.label}',
                    color: '#c03030'
                },
                sonification: {
                    tracks: [{
                        mapping: {
                            pan: 'lon',
                            pitch: {
                                mapTo: 'lat',
                                min: 'c3',
                                max: 'c6'
                            }
                        }
                    }],
                    contextTracks: [{
                        valueInterval: 0.5,
                        valueProp: 'index',
                        instrument: 'flute',
                        mapping: {
                            pitch: 'c6',
                            pan: -1,
                            volume: 0.15
                        }
                    }, {
                        valueInterval: 0.5,
                        valueProp: 'index',
                        instrument: 'flute',
                        mapping: {
                            pitch: 'c3',
                            pan: 1,
                            volume: 0.35
                        }
                    }]
                }
            }
        },

        series: [{
            name: 'Base map',
            dataLabels: {
                enabled: true,
                format: '{point.name}',
                filter: {
                    property: 'labelrank',
                    operator: '>',
                    value: 25
                }
            },
            borderColor: '#5E5A5D',
            nullColor: '#A8D4AD',
            sonification: {
                enabled: false
            }
        }, {
            name: 'Track 1',
            type: 'mappoint',
            color: '#e04040',
            data: [
                [-85, 28, 'start'],
                [-86, 28.5],
                [-86.2, 28.5],
                [-87, 28.5],
                [-87, 28.4],
                [-88, 28.3],
                [-89, 28.2],
                [-90, 28],
                [-91, 28.5],
                [-91, 28.3],
                [-92, 28.5],
                [-93, 27.5],
                [-94, 26],
                [-96, 25],
                [-96, 25],
                [-97, 25],
                [-97.1, 24.5],
                [-97, 24],
                [-96.5, 24],
                [-96, 23.3],
                [-95, 22.8],
                [-95.4, 22.7],
                [-94, 22],
                [-93, 21.5],
                [-92, 21],
                [-93.5, 20.5],
                [-92, 20.1],
                [-92, 21],
                [-91, 21.5],
                [-91, 22],
                [-90, 21.5],
                [-90, 22.2],
                [-89, 22],
                [-89, 22.5],
                [-88.5, 22.5],
                [-87.5, 23.5],
                [-86.5, 23],
                [-86, 23],
                [-85, 22],
                [-84.5, 21],
                [-84, 20.5],
                [-84, 19],
                [-83, 19.1],
                [-83, 19.2],
                [-82, 19.5, 'end']
            ]
        }]
    });


    // Play chart button
    document.getElementById('play').onclick = () => {
        if (chart.sonification.isPlaying()) {
            chart.sonification.cancel();
        } else {
            chart.sonify();
        }
    };
})();
