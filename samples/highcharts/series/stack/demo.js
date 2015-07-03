$(function () {
    $('#container').highcharts({
        chart: {
            type: 'column'
        },

        xAxis: {
            categories: ['One', 'Two', 'Three', 'Four', 'Five']
        },

        plotOptions: {
            column: {
                stacking: 'normal'
            }
        },

        series: [
        // first stack
            {
                data: [29.9, 71.5, 106.4, 129.2, 144.0],
                stack: 0
            }, {
                data: [30, 176.0, 135.6, 148.5, 216.4],
                stack: 0
            // second stack
            }, {
                data: [106.4, 129.2, 144.0, 29.9, 71.5],
                stack: 1
            }, {
                data: [148.5, 216.4, 30, 176.0, 135.6],
                stack: 1
            }
        ]
    });
});