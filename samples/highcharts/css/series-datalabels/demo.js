$(function () {
    Highcharts.chart('container', {

        title: {
            text: 'Styling data labels by CSS'
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr']
        },

        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    borderRadius: 2,
                    y: -10,
                    shape: 'callout'
                }
            }
        },

        series: [{
            data: [100, 300, {
                y: 500,
                dataLabels: {
                    className: 'highlight'
                }
            }, 400]
        }]

    });
});