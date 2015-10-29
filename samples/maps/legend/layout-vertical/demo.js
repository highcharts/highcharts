$(function () {

    $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=world-population-density.json&callback=?', function (data) {

        // Initiate the chart
        $('#container').highcharts('Map', {

            title : {
                text : 'Vertical gradient legend'
            },

            subtitle: {
                text: 'Population<br>density per km²',
                floating: true,
                align: 'left',
                verticalAlign: 'bottom',
                y: -120,
                x: 60
            },

            legend: {
                borderWidth: 0,
                layout: 'vertical',
                align: 'left',
                verticalAlign: 'bottom',
                floating: true,
                width: 100
            },

            mapNavigation: {
                enabled: true
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