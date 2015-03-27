$(function () {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container'
        },
        xAxis: {
            categories: ['In Highcharts <= 3.0.8, line height was too small'],
            labels: {
                style: {
                    color: 'red',
                    fontSize: '20px'
                },
                y: 20
            }
        },

        series: [{
            data: [1, 2]
        }]
    });
});