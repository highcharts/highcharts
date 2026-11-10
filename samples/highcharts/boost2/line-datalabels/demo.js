const n = 2e5,
    threshold = 78,
    x = new Float64Array(n),
    y = new Float64Array(n),
    start = Date.UTC(2020, 0, 1);

let value = 20;

for (let i = 0; i < n; i++) {
    x[i] = start + i * 60000;
    value += (Math.random() - 0.5) * 2 + (20 - value) * 0.01;

    // One reading jumps, so the filter below marks a single point
    // rather than a run of them.
    y[i] = value + (Math.random() < 0.00005 ? 60 + Math.random() * 25 : 0);
}

Highcharts.chart('container', {
    chart: {
        zooming: { type: 'x' }
    },
    title: {
        text: 'Boost2: 200,000 points, labelled above a threshold'
    },
    xAxis: {
        type: 'datetime'
    },
    yAxis: {
        title: { text: null }
    },
    series: [{
        type: 'line',
        boostThreshold: 1,
        name: 'Measurement',
        dataLabels: {
            enabled: true,
            format: '{y:.0f}',
            filter: {
                property: 'y',
                operator: '>',
                value: threshold
            }
        },
        dataTable: {
            columns: { x: x, y: y }
        }
    }]
});
