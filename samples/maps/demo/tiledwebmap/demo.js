(async () => {
    const mapData = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    // Initialize the chart
    Highcharts.mapChart('container', {

        title: {
            text: 'Highmaps basic TiledWebMap Series'
        },

        mapNavigation: {
            enabled: true
        },

        mapView: {
            projection: {
                name: 'WebMercator'
            },
            center: [10, 50],
            zoom: 4
        },

        series: [{
            type: 'tiledwebmap',
            name: 'Open Street Map tiles',
            mapData
        }, {
            type: 'mappoint',
            data: [{
                id: 'London',
                lat: 51.507222,
                lon: -0.1275
            }]
        }]
    });
})();
