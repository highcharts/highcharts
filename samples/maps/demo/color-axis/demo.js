$(function () {

    $.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=us-population-density.json&callback=?', function (data) {
    
        // Instanciate the map
        $('#container').highcharts('Map', {
            chart : {
                borderWidth : 1
            },
            
            title : {
                text : 'US population density (/km²)'
            },

            legend: {
                layout: 'horizontal',
                borderWidth: 0,
                backgroundColor: 'rgba(255,255,255,0.85)',
                floating: true,
                verticalAlign: 'top',
                y: 25
            },

            mapNavigation: {
                enabled: true
            },

            colorAxis: {
                min: 1,
                type: 'logarithmic',
                minColor: '#EEEEFF',
                maxColor: '#000022',
                stops: [
                    [0, '#EFEFFF'],
                    [0.67, '#4444FF'],
                    [1, '#000022']
                ]
            },
            
            series : [{
                animation: true,
                data : data,
                mapData: Highcharts.maps.us,
                joinBy: 'code',
                dataLabels: {
                    enabled: true,
                    color: 'white',
                    format: '{point.code}',
                    style: {
                        fontWeight: 'bold',
                        textShadow: '0 0 3px black',
                        textTransform: 'uppercase'
                    }
                },
                name: 'Population density',
                tooltip: {
                    pointFormat: '{point.code}: {point.value}/km²'
                }
            }]
        });
    });
});