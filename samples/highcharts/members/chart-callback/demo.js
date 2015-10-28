$(function () {

    (function (H) {
        Highcharts.Chart.prototype.callbacks.push(function (chart) {
            H.addEvent(chart.container, 'click', function (e) {
                e = chart.pointer.normalize();
                $('#report').html('Clicked chart at ' + e.chartX + ', ' + e.chartY);
            });
            H.addEvent(chart.xAxis[0], 'afterSetExtremes', function (e) {
                $('#report').html('Set extremes to ' + e.min.toFixed(2) + ', ' + e.max.toFixed(2));
            });
        });
    }(Highcharts));

    var chart = new Highcharts.Chart({

        chart: {
            renderTo: 'container',
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
});