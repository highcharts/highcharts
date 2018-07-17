
$.getJSON('https://cdn.rawgit.com/highcharts/highcharts/v6.0.4/samples/data/large-dataset.json', function (data) {
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