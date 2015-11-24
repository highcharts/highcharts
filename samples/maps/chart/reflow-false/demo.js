$(function () {

    $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=world-population-density.json&callback=?', function (data) {

        // Initiate the chart
        $('#container').highcharts('Map', {

            chart: {
                borderWidth: 1,
                reflow: false
            },

            title : {
                text : 'Chart with reflow disabled'
            },

            mapNavigation: {
                enabled: true,
                buttonOptions: {
                    alignTo: 'spacingBox',
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
                    text: 'Population per km²'
                },
                backgroundColor: 'rgba(255,255,255,0.85)'
            },

            // Add some padding inside the plot box
            xAxis: {
                minPadding: 0.02,
                maxPadding: 0.02
            },
            yAxis: {
                minPadding: 0.02,
                maxPadding: 0.02
            },

            // The map series
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