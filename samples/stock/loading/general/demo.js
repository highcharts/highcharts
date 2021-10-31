const chart = Highcharts.stockChart('container', {
    loading: {
        style: {
            backgroundColor: 'silver'
        },
        labelStyle: {
            color: 'white'
        }
    },

    rangeSelector: {
        selected: 1
    },

    series: [
        {
            name: 'USD to EUR',
            data: usdeur
        }
    ]
});

document.getElementById('showloading').addEventListener('click', () => {
    chart.showLoading();
});

document.getElementById('hideloading').addEventListener('click', () => {
    chart.hideLoading();
});
