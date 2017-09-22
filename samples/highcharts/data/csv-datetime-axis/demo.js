$(function () {
    Highcharts.chart('container', {

        title: {
            text: 'Datetime Axis'
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
                    enabled: false
                }
            }
        },

        series: [{
            lineWidth: 1
        }]
    });
});
