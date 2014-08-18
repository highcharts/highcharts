$(function () {
    // create the chart
    var chart = $('#container').highcharts('StockChart', {


        rangeSelector: {
            enabled: false
        },

        navigator: {
            enabled: false
        },


        series: [{
            type: 'column',
            data: [4,2,3,1]
        }]
    });


    $('#resize').click(function () {
        $('#container').highcharts().setSize(400, 400, false);
    });
});