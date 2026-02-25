Highcharts.chart('container', {
    chart: { type: 'bubble', animation: false, width: 600, height: 400 },
    plotOptions: { bubble: { maxSize: '100%' } },
    xAxis: { startOnTick: false, endOnTick: false },
    yAxis: { startOnTick: false, endOnTick: false },
    series: [{
        data: [[823667, -276003, 359003], [526000, -114001, 87001]]
    }]
});