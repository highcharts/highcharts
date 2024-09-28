function getData(n) {
    const arr = [];

    for (let i = 0; i < n; i++) {
        arr.push(Math.sin(Math.PI * 2 / 360 * i));
    }
    return arr;
}

const chart = Highcharts.chart('container', {
    chart: {
        styledMode: true
    },
    title: {
        text: 'Dense column borders'
    },
    series: [{
        type: 'column',
        name: 'Sinus',
        data: getData(360)
    }]
});

document.getElementById('dense').addEventListener('click', () => {
    chart.series[0].setData(getData(360));
});

document.getElementById('sparse').addEventListener('click', () => {
    chart.series[0].setData(getData(45));
});