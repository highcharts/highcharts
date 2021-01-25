const chart = Highcharts.stockChart('container', {
    scrollbar: {
        enabled: true
    },

    navigator: {
        enabled: true
    },

    rangeSelector: {
        selected: 1
    },

    series: [{
        name: 'MSFT',
        data: MSFT
    }]
});

document.getElementById('button').addEventListener('click', e => {
    chart.addSeries({
        name: 'ADBE',
        data: ADBE
    });
    e.target.disabled = true;
});
