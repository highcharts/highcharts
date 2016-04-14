$(function () {
    $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=large-dataset.json&callback=?', function(data) {
        $('#container').highcharts('StockChart', {
            chart: {
                zoomType: 'xy'
            },
            yAxis: {
                scrollbar: {
                    enabled: true
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