$(function () {

    $.getJSON('http://www.highcharts.local/samples/data/jsonp.php?filename=world-population-density.json&callback=?', function (data) {
        
        // Initiate the chart
        $('#container').highcharts('Map', {
            chart: {
                width: 600,
                height: 500
            },
            
            title : {
                text : 'Predefined axis min/max to define zoomed area'
            },

            mapNavigation: {
                enabled: true,
                buttonOptions: {
                    verticalAlign: 'bottom'
                }
            },

            xAxis: {
                min: 4000,
                max: 6200
            },

            yAxis: {
                min: 1400,
                max: 2400
            },

            colorAxis: {
                min: 1,
                max: 1000,
                type: 'logarithmic'
            },

            legend: {
                title: {
                    text: 'Population density per km²'
                }
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