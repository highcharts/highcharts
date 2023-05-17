// Create an array with data from y = 1 / x
const data = [];
for (let x = -6; x < 6; x += 0.01) {
    // Note: Push y = null for x = 0
    data.push([
        x, Math.round(x * 100) ? 1 / x : null
    ]);
}

// Create the chart
const chart = Highcharts.chart('container', {
    chart: {
        height: '100%'
    },
    title: {
        text: 'Sonified mathematical function',
        align: 'left'
    },
    sonification: {
        duration: 8000,
        defaultInstrumentOptions: {
            instrument: 'basic1',
            roundToMusicalNotes: false
        }
    },
    accessibility: {
        landmarkVerbosity: 'one'
    },
    xAxis: {
        min: -6,
        max: 6,
        gridLineWidth: 1,
        tickInterval: 1,
        crossing: 0
    },
    yAxis: {
        min: -6,
        max: 6,
        tickInterval: 1,
        lineWidth: 1,
        crossing: 0,
        title: {
            text: null
        }
    },
    legend: {
        enabled: false
    },
    tooltip: {
        headerFormat: '',
        pointFormat: 'y = {point.y:.2f}'
    },
    series: [{
        data
    }]
});

document.getElementById('sonify').onclick = function () {
    chart.toggleSonify();
};
