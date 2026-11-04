const chart = Highcharts.stockChart('container', {
    title: {
        text: 'Input types'
    },
    subtitle: {
        text: 'Try selecting different inputDateFormats and using the date ' +
        'inputs'
    },
    xAxis: {
        minRange: 3600 * 1000 // one hour
    },
    series: [
        {
            pointStart: '2025-01-01',
            pointInterval: 24 * 3600 * 1000,
            data: [1, 3, 2, 4, 3, 5, 4, 6, 3, 4, 2, 3, 1, 2, 1]
        }
    ]
});

document.getElementById('format').addEventListener('click', e => {
    const format = e.target.dataset.format;
    if (format) {
        chart.update({
            rangeSelector: {
                inputDateFormat: format
            }
        });
    }
});