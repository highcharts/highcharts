function getPoint(i) {
    return {
        name: Date.UTC(2018, 0, 1) + i * 1000,
        y: Math.random()
    };
}

const data = [];
const dataPoints = 20;

let i;
for (i = 0; i < dataPoints; i++) {
    data.push(getPoint(i));
}

const chart = Highcharts.chart('container', {
    chart: {
        backgroundColor: '#efe'
    },
    xAxis: {
        staticScale: 24,
        minRange: 1,
        categories: true
    },
    series: [
        {
            data: data,
            type: 'bar'
        }
    ]
});

document.getElementById('add').addEventListener('click', () => {
    chart.series[0].addPoint(getPoint(i++));
});

document.getElementById('remove').addEventListener('click', () => {
    chart.series[0].removePoint(0);
});
