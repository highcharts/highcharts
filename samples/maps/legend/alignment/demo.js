$(function () {

    $.getJSON('http://www.highcharts.local/samples/data/jsonp.php?filename=world-population-density.json&callback=?', function (data) {
        
        // Initiate the chart
        $('#container').highcharts('Map', {

            chart: {
                marginLeft: 70
            },
            
            title : {
                text : 'Legend alignment'
            },

            legend: {
                title: {
                    text: 'Population density per km²'
                },
                align: 'left',
                verticalAlign: 'middle',
                y: 100,
                floating: true
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

            series : [{
                data : data,
                mapData: Highcharts.maps.world,
                joinBy: 'code',
                name: 'Population density',
                states: {
                    hover: {
                        color: '#BADA55'
                    }
                },
                tooltip: {
                    valueSuffix: '/km²'
                }
            }]
        });
    });
});