$(function () {

    Highcharts.setOptions({
        chart: {
            backgroundColor: '#272822'
        },
        title: {
            style: {
                color: 'white'
            }
        },
        legend: {
            title: {
                style: {
                    color: 'silver'
                }
            }
        },
        colorAxis: {
            minColor: '#373832',
            maxColor: '#baFF55'
        }

    });

    $.getJSON('http://www.highcharts.local/samples/data/jsonp.php?filename=world-population-density.json&callback=?', function (data) {

        // Initiate the chart
        $('#container').highcharts('Map', {
            
            title : {
                text : 'Set general theme options'
            },

            mapNavigation: {
                enabled: true,
                buttonOptions: {
                    verticalAlign: 'bottom'
                }
            },

            colorAxis: {
                min: 1,
                max: 1000,
                type: 'logarithmic'
            },

            legend: {
                title: {
                    text: 'Population density (/km²)'
                }
            },

            series : [{
                data : data,
                mapData: Highcharts.maps.world,
                joinBy: 'code',
                name: 'Population density',
                tooltip: {
                    valueSuffix: '/km²'
                }
            }]
        });
    });
});