(async () => {
    const topology = await fetch(
            'https://code.highcharts.com/mapdata/custom/world.topo.json'
        ).then(response => response.json()),
        colors = Highcharts.getOptions().colors;

    Highcharts.getJSON('https://cdn.jsdelivr.net/gh/highcharts/highcharts@sha/samples/data/geoheatmap-cities-dataset.json', function (data) {
        Highcharts.mapChart('container', {
            chart: {
                map: topology
            },

            title: {
                text: 'GeoHeatMap Series Demo',
                floating: true,
                align: 'left',
                style: {
                    textOutline: '2px white'
                }
            },

            subtitle: {
                text: 'Cities of the World<br> Data source: <a href="https://github.com/lutangar/cities.json">https://github.com/lutangar/cities.json</a>',
                y: 34,
                align: 'left'
            },

            legend: {
                enabled: true
            },

            mapNavigation: {
                enabled: true,
                enableDoubleClickZoomTo: true,
                buttonOptions: {
                    verticalAlign: 'bottom'
                }
            },

            mapView: {
                projection: {
                    name: 'Orthographic'
                }
            },
            colorAxis: {
                dataClasses: [{
                    to: 100,
                    color: colors[0]
                }, {
                    from: 100,
                    to: 1e3,
                    color: colors[1]
                }, {
                    from: 1e3,
                    to: 5e3,
                    color: colors[2]
                }, {
                    from: 5e3,
                    color: colors[3]
                }]
            },

            series: [{
                states: {
                    inactive: {
                        enabled: false
                    }
                }
            }, {
                name: 'GeoHeatMap',
                opacity: 0.6,
                colsize: 10,
                rowsize: 10,
                type: 'geoheatmap',
                data: data
            }]
        });
    });
})();
