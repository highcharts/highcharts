
$.getJSON('https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/world-population-density.json', function (data) {

    // Prevent logarithmic errors in color calulcation
    $.each(data, function () {
        this.value = (this.value < 1 ? 1 : this.value);
    });

    // Initiate the chart
    Highcharts.mapChart('container', {
        chart: {
            map: 'custom/world'
        },

        title: {
            text: 'Zoom in on country by double click'
        },

        mapNavigation: {
            enabled: true,
            enableDoubleClickZoomTo: true
        },

        colorAxis: {
            min: 1,
            max: 1000,
            type: 'logarithmic'
        },

        series: [{
            data: data,
            joinBy: ['iso-a3', 'code3'],
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
