$(function () {

    $('#container').highcharts({

        chart: {
            width: 400,
            height: 250,
            marginTop: 100,
            marginBottom: 100
        },

        series: [{
            data: [0.0004, 0.00039999999999999996, 0.0004]
        }],

        yAxis: [{
            minorTickInterval: "auto"
        }]
    });
});