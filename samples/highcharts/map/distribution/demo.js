$(function () {

    var series = [];

    // Instanciate the map
    $('#container').highcharts('Map', {
        title : {
            text : 'Habitat of the Rusty Blackbird'
        },

        subtitle : {
            text : 'Source: <a href="http://en.wikipedia.org/wiki/File:Euphagus_carolinus_map.svg">Wikipedia</a>'
        },

        plotOptions: {
            series: {
                tooltip: {
                    headerFormat: '',
                    pointFormat: '{point.name}'
                }
            }
        },

        legend: {
            align: 'left',
            backgroundColor: 'white',
            floating: true,
            layout: 'vertical',
            verticalAlign: 'bottom'
        },

        
        series : series
    });
});