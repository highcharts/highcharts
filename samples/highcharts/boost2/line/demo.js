const n = 1e6,
    x = new Float64Array(n),
    y = new Float64Array(n),
    start = Date.UTC(2020, 0, 1);

let value = 0;
for (let i = 0; i < n; i++) {
    x[i] = start + i * 60000;
    value += Math.sin(i / 1500) * 0.05 + (Math.random() - 0.5);
    y[i] = value;
}

Highcharts.chart('container', {
    chart: {
        zooming: { type: 'xy' }
    },
    title: {
        text: 'Boost2: 1,000,000 points on WebGPU'
    },
    xAxis: {
        type: 'datetime'
    },
    yAxis: {
        title: { text: '' }
    },
    series: [{
        type: 'line',
        boostThreshold: 1,
        name: 'Measurement',
        dataTable: {
            columns: { x: x, y: y }
        }
    }]
});
