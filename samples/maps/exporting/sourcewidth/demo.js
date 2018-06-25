

$.getJSON('https://cdn.rawgit.com/highcharts/highcharts/680f5d50a47e90f53d814b53f80ce1850b9060c0/samples/data/world-population-density.json', function (data) {

    // Initiate the chart
    Highcharts.mapChart('container', {

        chart: {
            width: 800,
            height: 500
        },

        title: {
            text: 'Exporting sourceWidth and sourceHeight demo'
        },

        subtitle: {
            text: 'The on-screen chart is 800x500.<br/>The exported chart is 800x400<br/>(sourceWidth and sourceHeight<br/>multiplied by scale)',
            floating: true,
            align: 'left',
            y: 300
        },

        legend: {
            title: {
                text: 'Population density per km²'
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
                    color: '#a4edba'
                }
            },
            tooltip: {
                valueSuffix: '/km²'
            }
        }],

        exporting: {
            sourceWidth: 400,
            sourceHeight: 200,
            // scale: 2 (default)
            chartOptions: {
                subtitle: null
            }
        }
    });
});