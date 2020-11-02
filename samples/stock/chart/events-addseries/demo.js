const chart = Highcharts.stockChart('container', {
    chart: {
        events: {
            addSeries() {
                alert('A series was added');
            }
        }
    },

    rangeSelector: {
        selected: 1
    },

    series: [{
        name: 'MSFT',
        data: MSFT
    }]
});

// activate the button
document.getElementById('button').addEventListener('click', e => {
    chart.addSeries({
        name: 'ADBE',
        data: ADBE
    });

    e.target.disabled = true;
});
