$(function () {
    Highcharts.chart('container', {

        title: {
            text: 'Datetime Short Year Deduction (2000)'
        },

        subtitle: {
            text: 'Data input from CSV'
        },

        data: {
            csv: document.getElementById('csv').innerHTML
        },

        plotOptions: {
            series: {
                marker: {
                    enabled: true
                }
            }
        },

        series: [{
            lineWidth: 1
        }]
    });
});
