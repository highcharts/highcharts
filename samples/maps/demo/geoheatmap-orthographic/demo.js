(async () => {
    const topology = await fetch(
            'https://code.highcharts.com/mapdata/custom/world.topo.json'
        ).then(response => response.json()),

        data = await fetch(
            'https://cdn.jsdelivr.net/gh/highcharts/highcharts@5c536debb0/samples/data/geoheatmap-cities-dataset.json'
        ).then(response => response.json());

    Highcharts.mapChart('container', {
        chart: {
            map: topology
        },

        title: {
            text: 'GeoHeatMap Series Demo',
            align: 'left'
        },

        subtitle: {
            text: 'Density of Cities in the World by Latitude and Longitude' +
                '<br>Data source: <a href="https://github.com/lutangar/cities.json">' +
                'github.com/lutangar/cities.json</a>',
            align: 'left'
        },

        legend: {
            enabled: true
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        mapView: {
            maxZoom: 30,
            projection: {
                name: 'Orthographic',
                rotation: [-20, -20]
            }
        },

        colorAxis: {
            dataClasses: [{
                to: 100,
                color: 'rgba(51,132,51,0.3)'
            }, {
                from: 100,
                to: 1e3,
                color: 'rgba(173,255,91,0.3)'
            }, {
                from: 1e3,
                to: 5e3,
                color: 'rgba(255,173,51,0.3)'
            }, {
                from: 5e3,
                color: 'rgba(214,51,51,0.3)'
            }]
        },

        series: [{
            name: 'Othographic projection',
            states: {
                inactive: {
                    enabled: false
                }
            },
            accessibility: {
                exposeAsGroupOnly: true
            }
        }, {
            name: 'GeoHeatMap',
            type: 'geoheatmap',
            borderWidth: 1,
            colsize: 10,
            rowsize: 10,
            data: data
        }]
    });
})();
