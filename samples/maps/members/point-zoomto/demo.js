$(function () {

    $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=world-population-density.json&callback=?', function (data) {

        // Assign id's
        $.each(data, function () {
            this.id = this.code;
        });

        // Initiate the chart
        $('#container').highcharts('Map', {

            title: {
                text: 'Zoom to point'
            },

            subtitle: {
                text: 'Click a country to zoom to it. Use buttons below map for selected tests.'
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

            mapNavigation: {
                enabled: true,
                buttonOptions: {
                    verticalAlign: 'bottom'
                }
            },

            series : [{
                data : data,
                mapData: Highcharts.maps['custom/world-highres'],
                joinBy: ['iso-a2', 'code'],
                name: 'Population density',
                allowPointSelect: true,
                cursor: 'pointer',
                events: {
                    click: function (e) {
                        e.point.zoomTo();
                    }
                },
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