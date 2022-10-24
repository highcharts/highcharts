Highcharts.chart('container', {
    series: [{
        data: [2, 5, 1, 6, 7, 8, 5]
    }]
}, function () {
    const chart = this;
    document.getElementById('add-annotation').addEventListener(
        'click',
        function () {
            chart.addAnnotation({
                labels: [{
                    point: {
                        xAxis: 0,
                        yAxis: 0,
                        x: 5,
                        y: 8
                    },
                    text: 'Max value'
                }]
            });
        });
});
