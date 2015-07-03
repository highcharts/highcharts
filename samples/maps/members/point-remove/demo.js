$(function () {

    $.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=world-population-density.json&callback=?', function (data) {

        // Initiate the chart
        $('#container').highcharts('Map', {

            title: {
                text: 'Remove selected points'
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
                allowPointSelect: true,
                cursor: 'pointer',
                states: {
                    hover: {
                        color: '#BADA55'
                    },
                    select: {
                        color: '#EFFFEF',
                        borderColor: 'black',
                        dashStyle: 'dot'
                    }
                },
                tooltip: {
                    valueSuffix: '/km²'
                }
            }]
        });

        // Activate the button
        $('#remove').click(function () {
            $.each($('#container').highcharts().getSelectedPoints(), function () {
                this.remove();
            });
        });
    });
});