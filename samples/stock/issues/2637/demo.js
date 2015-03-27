$(function () {
    $('#container').highcharts('StockChart', {
        rangeSelector: {
            selected: 5
        },
        title: {
            text: 'Tooltip header didn\'t display minutes'
        },
        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y:.2f}</b><br/>',
            shared: false
        },
        series: [{
            name: 'ABC',
            data: [[1380671999000,13231],[1380758399000,13300],[1380844799000,13415],[1380931199000,13600],[1381190399000,13687],[1381276799000,13860],[1381363199000,13700],[1381449599000,13800],[1381535999000,13800],[1381795199000,13833],[1381881599000,13961],[1381967999000,14500],[1382054399000,14100],[1382140799000,14214],[1390175999000,13800]],
            tooltip: {
                valueDecimals: 2
            }
        }]
    });
});