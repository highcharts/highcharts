$(function () {

    $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=us-population-density.json&callback=?', function (data) {

        // Make it joinable
        $.each(data, function () {
            this.hasc = 'US.' + this.code.toUpperCase();
        });

        // Instanciate the map
        $('#container').highcharts('Map', {
            chart : {
                borderWidth : 1
            },

            title : {
                text : 'Data label format to show value'
            },

            legend: {
                title: {
                    text: 'US population density per km²'
                }
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
                data : data,
                mapData: Highcharts.maps['countries/us/us-all'],
                joinBy: 'hasc',
                dataLabels: {
                    enabled: true,
                    format: '{point.value:.1f}'
                },
                name: 'Population density',
                tooltip: {
                    pointFormat: '{point.code}: {point.value}/km²'
                }
            }]
        });
    });
});