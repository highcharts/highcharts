$(function () {
    $('#container').highcharts({

        title: {
            text: 'Issue in Highcharts 3.0.8 caused wrong hover color (should be lighter green)'
        },


        series: [{
            type: "column",
            data: [{
                color: "#99cc00",
                y: 1
            }, {
                color: "#99cc00",
                y: 1
            }]
        }]

    });
});