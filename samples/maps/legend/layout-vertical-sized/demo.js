

$.getJSON('https://cdn.rawgit.com/highcharts/highcharts/v6.0.4/samples/data/world-population-density.json', function (data) {

    // Initiate the chart
    Highcharts.mapChart('container', {

        title: {
            text: 'Vertical gradient legend'
        },

        subtitle: {
            text: 'Population<br>density per km²',
            floating: true,
            align: 'left',
            verticalAlign: 'bottom',
            y: -80,
            x: 60
        },

        legend: {
            borderWidth: 0,
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'bottom',
            floating: true,
            width: 100,
            symbolHeight: 100,
            symbolWidth: 20
        },

        mapNavigation: {
            enabled: true
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
                    color: '#a4edba'
                }
            },
            tooltip: {
                valueSuffix: '/km²'
            }
        }]
    });
});