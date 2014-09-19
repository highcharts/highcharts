$(function () {
    $('#container').highcharts({

        title: {
            text: 'Global temperature change'
        },

        subtitle: {
            text: 'Data module: options structure is modified before final rendering'
        },

        data: {
            csv: document.getElementById('csv').innerHTML,
            complete: function (options) {
                // Add another series to the output
                options.series.push({
                    name: 'Trend',
                    data: [{ x: 1880, y: -0.4 }, { x: 2010, y: 0.5 }],
                    dashStyle: 'dash'
                });
            }
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