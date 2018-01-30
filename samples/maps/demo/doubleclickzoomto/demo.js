
$.getJSON('https://cdn.rawgit.com/highcharts/highcharts/v6.0.4/samples/data/world-population-density.json', function (data) {

    // Initiate the chart
    Highcharts.mapChart('container', {
        chart: {
            map: 'custom/world'
        },

        title: {
            text: 'Zoom in on country by double click'
        },

        mapNavigation: {
            enabled: true,
            enableDoubleClickZoomTo: true
        },

        colorAxis: {
            min: 1,
            max: 1000,
            type: 'logarithmic'
        },

        series: [{
            data: data,
            joinBy: ['iso-a2', 'code'],
            name: 'Population density',
            states: {
                hover: {
                    color: '#a4edba'
                }
            },
            tooltip: {
                valueSuffix: '/km²'
            }
        }]
    });
});
