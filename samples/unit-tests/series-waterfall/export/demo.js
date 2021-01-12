QUnit.test('#14830: getSVG on waterfall chart with stackLabels and hidden series threw', assert => {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'waterfall'
        },
        xAxis: {
            categories: ['assigned', 'total']
        },
        yAxis: {
            stackLabels: {
                enabled: true
            }
        },
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
        series: [{
            data: [{
                name: 'assigned',
                y: 2
            }, {
                name: 'total',
                y: 0,
                isSum: true
            }]
        }]
    });

    chart.series[0].hide();
    chart.getSVG();

    assert.ok(true, 'It should not throw');
});
