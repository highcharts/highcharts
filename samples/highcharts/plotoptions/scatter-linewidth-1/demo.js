$(function () {
    $('#container').highcharts({
        chart: {
            type: 'scatter'
        },
        xAxis: {
            minPadding: 0.05,
            maxPadding: 0.05
        },

        plotOptions: {
            series: {
                lineWidth: 1
            }
        },

        series: [{
            data: [
                [34, 29.9],
                [35, 144.0],
                [43, 176.0],
                [46, 71.5],
                [12, 106.4],
                [78, 129.2]
            ]
        }]
    });
});