$(function () {
    Highcharts.chart('container', {

        title: {
            text: 'Deduce mmddyyyy format'
        },

        subtitle: {
            text: 'Data input from CSV'
        },

        data: {
            csv: document.getElementById('csv').innerHTML,
            decimalPoint: null,
            itemDelimiter: null
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
