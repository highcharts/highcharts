$(function () {
        
    // Initiate the chart
    $('#container').highcharts('Map', {
        
        title : {
            text : 'Empty map'
        },
        
        series : [{
            mapData: Highcharts.geojson(Highcharts.maps['custom/world']),
            name: 'World map'
        }]
    });
});