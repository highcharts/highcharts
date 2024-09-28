console.time('line');
Highcharts.chart('container', {
    title: {
        text: 'Boosted line chart with individually colored data'
    },
    plotOptions: {
        series: {
            boostThreshold: 1
        }
    },
    series: [{
        data: Array.from({ length: 30 }, (_, i) => ({
            x: i,
            y: i,
            color: i % 2 === 0 ? '#00f' : '#f0f'
        }))
    }, {
        data: Array.from({ length: 30 }, (_, i) => ({
            x: -i,
            y: -i,
            color: i % 3 === 0 ? '#ff0' : '#f00'
        }))
    }]
});
console.timeEnd('line');
