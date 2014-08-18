$(function () {
    $('#container').highcharts({
        chart: {
            type: 'area'
        },

        title: {
            text: 'A gridZIndex of 4 renders the grid lines above the graph'
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            gridLineWidth: 1,
            gridZIndex: 4
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
    });
});