const chart = Highcharts.stockChart('container', {
    rangeSelector: {
        selected: 1
    },

    series: [{
        name: 'USD to EUR',
        data: usdeur
    }]
});

let isLoading = false;

document.getElementById('button').addEventListener('click', e => {
    if (!isLoading) {
        chart.showLoading();
        e.target.innerHTML = 'Hide loading';
    } else {
        chart.hideLoading();
        e.target.innerHTML = 'Show loading';
    }
    isLoading = !isLoading;
});
