

$.getJSON('https://cdn.rawgit.com/highcharts/highcharts/680f5d50a47e90f53d814b53f80ce1850b9060c0/samples/data/world-population-density.json', function (data) {

    // Initiate the chart
    Highcharts.mapChart('container', {

        title: {
            text: 'Dashed borders'
        },

        legend: {
            title: {
                text: 'Population density per km²'
            }
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
            dashStyle: 'dot',
            borderColor: 'gray',
            states: {
                hover: {
                    color: '#a4edba'
                },
                select: {
                    color: 'black'
                }
            },
            tooltip: {
                valueSuffix: '/km²'
            }
        }]
    });
});