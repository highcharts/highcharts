

$.getJSON('https://cdn.rawgit.com/highcharts/highcharts/v6.0.4/samples/data/world-population-density.json', function (data) {

    // Initiate the chart
    Highcharts.mapChart('container', {

        title: {
            text: 'Population density by country (/km²)'
        },

        subtitle: {
            text: 'Darker border on hover'
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        colorAxis: {
            min: 1,
            max: 1000,
            type: 'logarithmic'
        },

        series: [{
            data: data,
            mapData: Highcharts.maps['custom/world'],
            joinBy: ['iso-a2', 'code'],
            name: 'Population density',
            states: {
                hover: {
                    color: '#a4edba',
                    borderColor: 'gray'
                }
            },
            tooltip: {
                valueSuffix: '/km²'
            }
        }]
    });
});