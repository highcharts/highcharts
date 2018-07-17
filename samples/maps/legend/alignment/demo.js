

$.getJSON('https://cdn.rawgit.com/highcharts/highcharts/680f5d50a47e90f53d814b53f80ce1850b9060c0/samples/data/world-population-density.json', function (data) {

    // Initiate the chart
    Highcharts.mapChart('container', {

        chart: {
            marginLeft: 70
        },

        title: {
            text: 'Legend alignment'
        },

        legend: {
            title: {
                text: 'Population density per km²'
            },
            align: 'left',
            verticalAlign: 'middle',
            y: 100,
            floating: true,
            borderWidth: 1,
            backgroundColor: 'white'
        },

        mapNavigation: {
            enabled: true,
            enableButtons: false
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