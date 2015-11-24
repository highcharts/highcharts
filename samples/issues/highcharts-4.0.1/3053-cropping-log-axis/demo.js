
$(function () {
    window.chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            type: 'area'
        },
        title: {
            text: 'Series should extend to 1k'
        },
        xAxis: {
            type: 'logarithmic'
        },
        series: [{
            data: (function () {
                var points = [];
                for (var i = 1; i < 1000; i++) {
                    points.push([i, i]);
                }
                return points;
            }())
        }]
    });
});