
$.getJSON('https://cdn.rawgit.com/highcharts/highcharts/v6.0.5/samples/data/range.json', function (data) {

    Highcharts.stockChart('container', {

        chart: {
            type: 'arearange'
        },

        title: {
            text: 'Data grouping on individual series. Groups should be weeks.'
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
            dataGrouping: {
                groupPixelWidth: 20
            }
        }]

    });
});
