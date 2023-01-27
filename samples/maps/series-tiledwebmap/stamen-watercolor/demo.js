(async () => {
    const mapData = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    // Initialize the chart
    Highcharts.mapChart('container', {
        chart: {
            map: mapData
        },

        title: {
            text: 'Tiled Web Map Service Example'
        },

        mapNavigation: {
            enabled: true
        },

        mapView: {
            fitToGeometry: {
                type: 'MultiPoint',
                coordinates: [
                    // Alaska west
                    [-164, 54],
                    // Greenland north
                    [-35, 84],
                    // New Zealand east
                    [179, -38],
                    // Chile south
                    [-68, -55]
                ]
            }
        },

        series: [{
            type: 'tiledwebmap',
            name: 'Stamen tiles',
            provider: {
                type: 'Stamen',
                theme: 'watercolor'
            }
        }, {
            type: 'mappoint',
            name: 'Cities',
            data: [{
                name: 'Amsterdam',
                geometry: {
                    type: 'Point',
                    coordinates: [4.90, 53.38]
                }
            }, {
                name: 'Los Angeles',
                geometry: {
                    type: 'Point',
                    coordinates: [-118.24, 34.05]
                }
            }, {
                name: 'Beijing',
                geometry: {
                    type: 'Point',
                    coordinates: [116.22, 39.55]
                }
            }]
        }, {
            type: 'mapline',
            name: 'Routes',
            color: '#000',
            data: [{
                geometry: {
                    type: 'LineString',
                    coordinates: [
                        [4.90, 53.38], // Amsterdam
                        [-118.24, 34.05] // Los Angeles
                    ]
                },
                color: '#00ff00'
            }, {
                geometry: {
                    type: 'LineString',
                    coordinates: [
                        [4.90, 53.38], // Amsterdam
                        [116.22, 39.55] // Beijing
                    ]
                },
                color: '#ff0000'
            }],
            lineWidth: 2
        }]
    });
})();
