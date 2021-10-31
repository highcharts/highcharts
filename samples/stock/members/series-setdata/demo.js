const chart = Highcharts.stockChart('container', {
    rangeSelector: {
        selected: 1
    },

    series: [
        {
            name: 'MSFT',
            data: MSFT
        }
    ]
});

document.getElementById('button').addEventListener('click', (e) => {
    chart.series[0].setData(ADBE);
    e.target.disabled = true;
});
