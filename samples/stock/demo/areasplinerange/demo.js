
// Notice that the dataset has missing data
$.getJSON('https://cdn.rawgit.com/highcharts/highcharts/v6.0.5/samples/data/range.json', function (data) {

    Highcharts.stockChart('container', {

        chart: {
            type: 'areasplinerange'
        },

        rangeSelector: {
            selected: 2
        },

        title: {
            text: 'Temperature variation by day'
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
