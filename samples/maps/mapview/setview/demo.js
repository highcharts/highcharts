let chart;
Highcharts.getJSON('https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/world-population-density.json', function (data) {

    // Initiate the chart
    chart = Highcharts.mapChart('container', {

        chart: {
            width: 600,
            height: 500
        },

        title: {
            text: 'Set map view'
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
            states: {
                hover: {
                    color: '#a4edba'
                }
            },
            tooltip: {
                valueSuffix: '/km²'
            }
        }]
    });
});

const zoomToEurope = () => chart.mapView.setView(
    [4500, 8300], // In terms of pre-projected units
    15
);

document.getElementById('setextremes').onclick = zoomToEurope;
