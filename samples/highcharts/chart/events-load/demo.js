$(function () {
    // create the chart
    $('#container').highcharts({
        chart: {
            events: {
                load: function(event) {
                    alert ('Chart loaded');
                }
            }        
        },
        xAxis: {
        },
        
        series: [{
            animation: false,
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]     
        }]
    });
});