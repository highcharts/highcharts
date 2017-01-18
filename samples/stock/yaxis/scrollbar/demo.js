$(function () {
    $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=large-dataset.json&callback=?', function (data) {
        Highcharts.stockChart('container', {
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: 'Scrollbar on Y axis'
            },
            subtitle: {
                text: 'Zoom in to see the scrollbar'
            },
            yAxis: {
                scrollbar: {
                    enabled: true,
                    showFull: false
                }
            },
            series: [{
                data: data.data,
                pointStart: data.pointStart,
                pointInterval: data.pointInterval
            }]
        });
    });
});