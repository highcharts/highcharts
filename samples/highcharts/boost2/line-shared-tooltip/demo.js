const n = 5e5,
    start = Date.UTC(2020, 0, 1),
    names = ['North', 'Centre', 'South'];

// A slow drift back towards the starting level, so the three stay apart
// and the tooltip reads as three distinct instruments.
function readings(level) {
    const x = new Float64Array(n),
        y = new Float64Array(n);

    let value = level;

    for (let i = 0; i < n; i++) {
        x[i] = start + i * 60000;
        value += (Math.random() - 0.5) * 2 + (level - value) * 0.002;
        y[i] = value;
    }

    return { x: x, y: y };
}

Highcharts.chart('container', {
    chart: {
        zooming: { type: 'x' }
    },
    title: {
        text: 'Boost2: a shared tooltip over 1,500,000 points'
    },
    subtitle: {
        text: 'Three series of 500,000 readings, every one drawn on the GPU'
    },
    xAxis: {
        type: 'datetime',
        crosshair: true
    },
    yAxis: {
        title: { text: 'Reading' }
    },
    tooltip: {
        shared: true,
        valueDecimals: 1
    },
    series: names.map((name, i) => ({
        type: 'line',
        boostThreshold: 1,
        lineWidth: 1,
        name: name,
        dataTable: {
            columns: readings(i * 45)
        }
    }))
});
