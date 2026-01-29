const colors = ['#f00', '#ff0', '#0f0', '#0ff', '#00f', '#f0f'];
const bigData = Array.from({ length: 10000 }, (_, i) => [
    i,
    Math.random(),
    colors[Math.round(i / 1000) % 6]
]);

Highcharts.chart('container', {
    title: {
        text: 'Boosted series with point colors'
    },
    series: [
        {
            type: 'scatter',
            boostThreshold: 1,
            keys: ['x', 'y', 'color'],
            data: bigData
        }
    ]
});
