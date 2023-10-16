const chart = Highcharts.chart('container', {
    chart: {
        zoomType: 'x'
    },
    title: {
        text: 'Hide overlapping data labels'
    },
    series: [{
        data: ((arr, len) => {
            let i;
            for (i = 0; i < len; i = i + 1) {
                arr.push(i);
            }
            return arr;
        })([], 50),
        dataLabels: {
            enabled: true,
            y: -5
        }
    }]
});

document.getElementById('setextremes').addEventListener('click', () => {
    chart.xAxis[0].setExtremes(10, 15);
});

document.getElementById('unsetextremes').addEventListener('click', () => {
    chart.xAxis[0].setExtremes();
});
