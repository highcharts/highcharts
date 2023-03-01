(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    Highcharts.getJSON('https://cdn.jsdelivr.net/gh/highcharts/highcharts@sha/samples/data/geoheatmap-aerosol-dataset.json', function (data) {
        Highcharts.mapChart('container', {

            chart: {
                map: topology,
                backgroundColor: '#000',
                animation: false
            },

            title: {
                text: 'GeoHeatmap Aerosol Particle Radius In September 2016',
                align: 'left',
                style: {
                    color: '#fff'
                }
            },

            subtitle: {
                text: 'Data source: <a style="color: grey" href="https://neo.gsfc.nasa.gov/view.php?datasetId=MYDAL2_M_AER_RA&date=2016-09-01">NEO Nasa Earth Observations</a>',
                y: 34,
                align: 'left'
            },

            legend: {
                enabled: false
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
                    name: 'EqualEarth'
                }
            },

            colorAxis: {
                stops: [
                    [0.1, 'rgba(26,152,800,0.9)'],
                    [0.2, 'rgba(140,206,103, 0.9)'],
                    [0.4, 'rgba(224,242,149, 0.9)'],
                    [0.6, 'rgba(254,229,147,0.9)'],
                    [0.8, 'rgba(249,148,85,0.9'],
                    [1, 'rgba(215,48,39,0.9)']
                ]
            },

            series: [{
                name: 'Equal Earth',
                nullColor: 'transparent',
                states: {
                    inactive: {
                        enabled: false
                    }
                }
            }, {
                name: 'GeoHeatMap',
                colsize: 1,
                rowsize: 1,
                data,
                type: 'geoheatmap'
            }]
        });
    });
})();
