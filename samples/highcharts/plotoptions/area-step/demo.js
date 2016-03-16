$(function () {

    $("#container").highcharts({
        chart: {
            type: 'area'
        },

        title: {
            text: 'Stacked step area chart'
        },

        plotOptions: {
            area: {
                stacking: 'normal',
                step: 'right'
            }
        },
        series: [{
            name: "Example 1",
            data: [0, 1, 1, 1, 1, 2, 2, 2, 3, 3, 4, 2, 1, 1, 0, 0, 0, 0, 0]
        }, {
            name: "Example 2",
            data: [0, 1, 1, 1, 1, 2, 2, 2, 3, 3, 4, 2, 1, 1, 0, 0, 0, 0, 0]
        }]
    });

});