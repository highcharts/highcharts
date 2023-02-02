Highcharts.mapChart('container', {
    title: {
        text: 'Highcharts Maps TiledWebMap Series with map points'
    },

    mapNavigation: {
        enabled: true
    },

    mapView: {
        zoom: 2
    },

    series: [{
        type: 'tiledwebmap',
        name: 'Open Street Map tiles',
        provider: {
            type: 'OpenStreetMap'
        }
    }, {
        type: 'mappoint',
        name: 'Map points',
        enableMouseTracking: false,
        dataLabels: {
            enabled: true
        },
        data: [{
            name: 'London',
            lat: 51.507222,
            lon: -0.1275
        }, {
            name: 'Vik i Sogn',
            lat: 61.087220,
            lon: 6.579700
        }, {
            name: 'Krakow',
            lon: 19.944981,
            lat: 50.064651
        }, {
            name: 'Kowloon',
            lon: 114.183,
            lat: 22.317
        }, {
            name: 'Windhoek',
            lat: -22.55900,
            lon: 17.06429
        }, {
            name: 'Doha',
            lat: 25.28547,
            lon: 51.53037
        }, {
            name: 'Vancouver',
            lat: 49.28315,
            lon: -123.12202
        }]
    }]
});
