$(function () {
    $('#container').highcharts({
        xAxis: {
            plotBands: [{ // mark the weekend
                color: '#FCFFC5',
                from: Date.UTC(2010, 0, 2),
                to: Date.UTC(2010, 0, 4),
                label: {
                    text: 'Plot band',
                    style: {
                        color: 'blue',
                        fontWeight: 'bold'
                    }
                }
            }],
            tickInterval: 24 * 3600 * 1000, // one day
            type: 'datetime'
        },

        series: [{
            data: [29.9, 71.5, 56.4, 69.2, 144.0, 176.0, 135.6, 148.5, 216.4],
            pointStart: Date.UTC(2010, 0, 1),
            pointInterval: 24 * 3600 * 1000
        }]
    });
});