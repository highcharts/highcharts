$(function () {
    Highcharts.chart('container', {

        title: {
            text: 'Deduce US format'
        },

        subtitle: {
            text: 'Data input from CSV'
        },

        data: {
            csv: document.getElementById('csv').innerHTML,
            decimalPoint: null,
            itemDelimiter: null,
            dateFormat: false
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
