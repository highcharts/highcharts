

$.getJSON('https://cdn.rawgit.com/highcharts/highcharts/680f5d50a47e90f53d814b53f80ce1850b9060c0/samples/data/world-population-density.json', function (data) {

    // Assign id's
    $.each(data, function () {
        this.id = this.code;
    });

    // Initiate the chart
    var chart = Highcharts.mapChart('container', {

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

        series: [{
            data: data,
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
                    color: '#a4edba'
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
        chart.get('EC').zoomTo();
    });
    $('#south-korea').click(function () {
        chart.get('KR').zoomTo();
    });
    $('#zoom-out').click(function () {
        chart.mapZoom();
    });
});
