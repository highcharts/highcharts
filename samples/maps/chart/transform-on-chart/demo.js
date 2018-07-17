

var transforms = {
    'default': Highcharts.maps['countries/gb/gb-all']['hc-transform']['default'], // eslint-disable-line dot-notation
    custom: Highcharts.maps['countries/gb/gb-all']['hc-transform']['gb-all-shetland']
};

delete Highcharts.maps['countries/gb/gb-all']['hc-transform']; // Remove transform from map

// Initiate the chart
Highcharts.mapChart('container', {
    chart: {
        map: Highcharts.maps['countries/gb/gb-all'],
        mapTransforms: transforms
    },

    title: {
        text: 'Highmaps lat/lon demo'
    },

    series: [{
        name: 'basemap',
        showInLegend: false
    }, {
        // Specify points using lat/lon
        type: 'mappoint',
        data: [{
            name: 'London',
            lat: 51.507222,
            lon: -0.1275
        }, {
            name: 'Birmingham',
            lat: 52.483056,
            lon: -1.893611
        }, {
            name: 'Lerwick (auto transformed)',
            lat: 60.155,
            lon: -1.145
        }]
    }]
});


