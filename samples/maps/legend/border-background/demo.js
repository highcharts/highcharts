$(function () {

    $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=world-population-density.json&callback=?', function (data) {

        // Initiate the chart
        $('#container').highcharts('Map', {

            chart: {
                marginLeft: 70
            },

            title : {
                text : 'Legend border and background options'
            },

            legend: {
                title: {
                    text: 'Population density per km²',
                    style: {
                        color: 'white'
                    }
                },
                backgroundColor: '#303030',
                borderColor: '#ffffff',
                borderWidth: 2,
                borderRadius: 0,
                shadow: true
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
                mapData: Highcharts.maps['custom/world'],
                joinBy: ['iso-a2', 'code'],
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