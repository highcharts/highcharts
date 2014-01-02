$(function () {

    $.getJSON('http://www.highcharts.local/samples/data/jsonp.php?filename=world-population-density.json&callback=?', function (data) {
        
        // Assign id's
        $.each(data, function () {
            this.id = this.code;
        });

        // Initiate the chart
        $('#container').highcharts('Map', {

            title: {
                text: 'Update point'
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
                mapData: Highcharts.maps.world,
                joinBy: 'code',
                name: 'Population density',
                allowPointSelect: true,
                cursor: 'pointer',
                states: {
                    hover: {
                        color: '#BADA55'
                    }
                },
                tooltip: {
                    pointFormat: '{point.id} {point.name}',
                    valueSuffix: '/km²'
                }
            }]
        });

        // Activate the buttons
        $('#ecuador').click(function () {
            $('#container').highcharts().get('EC').zoomTo();
        });
        $('#south-korea').click(function () {
            $('#container').highcharts().get('KR').zoomTo();
        });
        $('#zoom-out').click(function () {
            $('#container').highcharts().mapZoom();
        });
    });
});