$(function () {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            type: 'area'
        },
        title: {
            text: 'Percentage stacking with missing values'
        },
        plotOptions: {
            area: {
                stacking: 'percent'
            }
        },

        series: [{
            data: [1, 1, 1, 1]
        }, {
            data: [2, 2]
        }, {
            data: [3, 3, 3, 3]
        }]

    });
});