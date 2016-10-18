$(function () {
    $('#container').highcharts({

        xAxis: {
            plotBands: [{
                from: -1.1,
                to: 1.1,
                color: Highcharts.Color(Highcharts.getOptions().colors[4]).setOpacity(0.75).get()
            }]
        },

        yAxis: {
            plotBands: [{
                from: 0.1,
                to: 3.1,
                color: Highcharts.Color(Highcharts.getOptions().colors[3]).setOpacity(0.75).get()
            }]
        },

        series: [{
            data: [2, 3, 4, 5]
        }]
    });
});