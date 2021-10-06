Highcharts.getJSON('https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/world-population-density.json', function (data) {

    // Initiate the chart
    Highcharts.mapChart('container', {
        chart: {
            width: 600,
            height: 500
        },

        title: {
            text: 'Predefined zoomed area'
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        mapView: {
            center: [4500, 8300], // In terms of pre-projected units
            zoom: 15
        },

        colorAxis: {
            min: 1,
            max: 1000,
            type: 'logarithmic'
        },

        legend: {
            title: {
                text: 'Population density per km²'
            }
        },

        series: [{
            data: data,
            mapData: Highcharts.maps['custom/world'],
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