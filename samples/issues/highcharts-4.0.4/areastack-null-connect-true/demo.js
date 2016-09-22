$(function () {
    $('#container').highcharts({

        chart: {
            type: 'area'
        },

        title: {
            text: 'Stacked area'
        },

        subtitle: {
            text: 'connectNulls = true'
        },

        plotOptions: {
            series: {
                stacking: 'normal',
                connectNulls: true
            }
        },

        series: [{
            data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        }, {
            data: [1, 2, 3, 4, 5, 4, 3, 2, 1],
            pointStart: 2
        }, {
            data: [1, 2, null, 2, 1, 1]
        }]

    });

});
