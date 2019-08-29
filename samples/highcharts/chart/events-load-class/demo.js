(function (H) {
    H.addEvent(H.Chart, 'load', function (e) {
        var chart = e.target;
        H.addEvent(chart.container, 'click', function (e) {
            e = chart.pointer.normalize(e);
            console.log('Clicked chart at ' + e.chartX + ', ' + e.chartY);
        });
        H.addEvent(chart.xAxis[0], 'afterSetExtremes', function (e) {
            console.log('Set extremes to ' + e.min + ', ' + e.max);
        });
    });
}(Highcharts));

Highcharts.chart('container', {

    chart: {
        zoomType: 'x'
    },

    title: {
        text: 'Events added from Chart prototype'
    },

    subtitle: {
        text: 'Drag and click to view events'
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },

    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
    }]

});