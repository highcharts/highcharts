$(function () {

    $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=world-population-density.json&callback=?', function (data) {

        // Initiate the chart
        $('#container').highcharts('Map', {

            chart: {
                width: 800,
                height: 500
            },

            title : {
                text : 'Exporting sourceWidth and sourceHeight demo'
            },

            subtitle: {
                text: 'The on-screen chart is 800x500.<br/>The exported chart is 800x400<br/>(sourceWidth and sourceHeight<br/>multiplied by scale)',
                floating: true,
                align: 'left',
                y: 300
            },

            legend: {
                title: {
                    text: 'Population density per km²'
                }
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
            }],

            exporting: {
                sourceWidth: 400,
                sourceHeight: 200,
                // scale: 2 (default)
                chartOptions: {
                    subtitle: null
                }
            }
        });
    });
});