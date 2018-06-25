

$.getJSON('https://cdn.rawgit.com/highcharts/highcharts/680f5d50a47e90f53d814b53f80ce1850b9060c0/samples/data/world-population-density.json', function (data) {

    // Initiate the chart
    Highcharts.mapChart('container', {

        chart: {
            width: 800
        },

        title: {
            text: 'Tooltip positioner demo'
        },

        legend: {
            title: {
                text: 'Population density per km²'
            }
        },

        tooltip: {
            positioner: function () {
                return { x: 0, y: 250 };
            },
            borderWidth: 0,
            shadow: false
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