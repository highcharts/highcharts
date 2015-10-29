$(function () {

    $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=world-population-density.json&callback=?', function (data) {

        // Initiate the chart
        $('#container').highcharts('Map', {

            title : {
                text : 'Grid line options'
            },

            mapNavigation: {
                enabled: true,
                buttonOptions: {
                    verticalAlign: 'bottom'
                }
            },

            legend: {
                title: {
                    text: 'Population density (/km²)'
                }
            },

            colorAxis: {
                min: 1,
                max: 1000,
                type: 'logarithmic',
                gridLineWidth: 2,
                gridLineColor: 'white',
                minorTickInterval: 0.1,
                minorGridLineColor: 'white',
                tickLength: 0
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