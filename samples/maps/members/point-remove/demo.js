

$.getJSON('https://cdn.rawgit.com/highcharts/highcharts/v6.0.4/samples/data/world-population-density.json', function (data) {

    // Initiate the chart
    var chart = Highcharts.mapChart('container', {

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

        series: [{
            data: data,
            mapData: Highcharts.maps['custom/world'],
            joinBy: ['iso-a2', 'code'],
            name: 'Population density',
            allowPointSelect: true,
            cursor: 'pointer',
            states: {
                hover: {
                    color: '#a4edba'
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
        $.each(chart.getSelectedPoints(), function () {
            this.remove();
        });
    });
});
