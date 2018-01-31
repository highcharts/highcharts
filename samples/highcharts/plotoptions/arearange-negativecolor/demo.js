
$.getJSON('https://cdn.rawgit.com/highcharts/highcharts/v6.0.5/samples/data/range.json', function (data) {

    Highcharts.chart('container', {

        chart: {
            type: 'arearange'
        },

        title: {
            text: 'Temperature variation by day'
        },

        xAxis: {
            type: 'datetime'
        },

        yAxis: {
            title: {
                text: null
            }
        },

        tooltip: {
            crosshairs: true,
            shared: true,
            valueSuffix: '°C'
        },

        legend: {
            enabled: false
        },

        series: [{
            name: 'Temperatures',
            data: data,
            color: '#FF0000',
            negativeColor: '#0088FF'
        }]

    });
});
