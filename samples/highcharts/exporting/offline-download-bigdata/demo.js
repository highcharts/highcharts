$(function () {
    // NOTE: dataURL length limits in certain browsers. #6108

    var arr = [];
    for (var i = 0; i < 100000; i++) {
        arr.push(i);
    }

    Highcharts.chart('container', {
        exporting: {
            fallbackToExportServer: false
        },
        title: {
            text: 'Lots of data points, test PDF in particular'
        },
        series: [{
            data: arr
        }]
    });

});
