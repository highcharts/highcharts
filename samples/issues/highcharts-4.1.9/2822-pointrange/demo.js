
$(function () {
    var chart = $("#container").highcharts({
        chart: {
            type: 'column'
        },

        xAxis: {
            ordinal: true
        },

        series: [{
            data: [
                [0, 1],
                [1, 1],
                [10, 1],
                [20, 1],
                [30, 1]
            ]
        }, {
            data: [
                [0, 1],
                //[1, null],
                //[10, null],
                [20, 1]
                //[30, null]
            ]
        }]
    }).highcharts();
});