$(function () {
    $('#container').highcharts({
        title: {
            text: 'Demo of the <em>showInLegend</em> option'
        },
        subtitle: {
            text: 'The first series should show in the legend, the second series not'
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }, {
            data: [144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4, 129.2],
            showInLegend: false
        }]
    });
});