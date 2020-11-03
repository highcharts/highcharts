const chart = Highcharts.stockChart('container', {
    chart: {
        events: {
            redraw: function () {
                alert('The chart is being redrawn');
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
