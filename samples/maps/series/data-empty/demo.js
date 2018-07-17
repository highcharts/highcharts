

// Initiate the chart
Highcharts.mapChart('container', {

    title: {
        text: 'Empty map'
    },

    series: [{
        mapData: Highcharts.maps['custom/world'],
        name: 'World map'
    }]
});