
$.getJSON('https://cdn.rawgit.com/highcharts/highcharts/v6.0.5/samples/data/range.json', function (data) {

    Highcharts.stockChart('container', {

        chart: {
            type: 'arearange'
        },

        rangeSelector: {
            allButtonsEnabled: true,
            selected: 2
        },

        title: {
            text: 'Temperature variation by day'
        },

        subtitle: {
            text: 'Demo of all buttons enabled. Even though "YTD" and "1y" don\'t apply since we\'re <br>only showing values within one year, they are enabled to allow dynamic interaction'
        },

        tooltip: {
            valueSuffix: '°C'
        },

        series: [{
            name: 'Temperatures',
            data: data
        }]

    });
});
