

var data = [1, 3, 5, 2, 4, 1, 3];


// Initiate the chart
Highcharts.mapChart('container', {

    title: {
        text: 'Data joined by <em>null</em>'
    },

    mapNavigation: {
        enabled: true,
        buttonOptions: {
            verticalAlign: 'bottom'
        }
    },

    colorAxis: {},

    series: [{
        data: data,
        mapData: Highcharts.maps['custom/nordic-countries-core'],
        joinBy: null,
        name: 'Random data',
        states: {
            hover: {
                color: '#a4edba'
            }
        }
    }]
});