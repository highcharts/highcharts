$(function () {
    $('#container').highcharts({
        chart: {
            type: "bar",
            height: 200
        },

        title: {
            text: 'Bug in 3.0.7 caused X axis labels to partly disappear'
        },

        series: [{
            data: [1, 3, 2],
            xAxis: 0
        }, {
            data: [4,6,5],
            xAxis: 1
        }],

        xAxis: [{
            categories: ["AB", "CD", "EF"]
        }, {
        }]
    });

});