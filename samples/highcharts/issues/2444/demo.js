$(function () {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container'
        },
        xAxis: {
            categories: ['In Highcharts <= 3.0.8, line height was too small'],
            labels: {
                maxStaggerLines: 1,
                rotation: 0,
                style: {
                    color: 'red',
                    fontSize: '20px'
                },
                y: 20
            }
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
    });
});