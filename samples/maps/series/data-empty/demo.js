$(function () {
        
    // Initiate the chart
    $('#container').highcharts('Map', {
        
        title : {
            text : 'Empty map'
        },
        
        series : [{
            mapData: Highcharts.maps.world,
            name: 'World map'
        }]
    });
});