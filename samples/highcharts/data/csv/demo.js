$(function () {
    $('#container').highcharts({

        title: {
            text: 'Global temperature change'
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
        }, {
            type: 'areaspline',
            color: '#c4392d',
            negativeColor: '#5679c4',
            fillOpacity: 0.5
        }]
    });
});