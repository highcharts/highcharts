$(function () {
    // Create the chart
    $('#container').highcharts({

        title: {
            text: 'Huge numbers failed with JS error'
        },

        series: [{
            data: [
            1.7976931348623157e+300,
            1.7976931348623157e+301,
            1.7976931348623157e+306]
        }]
    });
});