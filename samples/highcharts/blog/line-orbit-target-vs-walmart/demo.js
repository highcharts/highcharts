Highcharts.chart('container', {
    chart: {
        type: 'spline'
    },
    orbit: {
        enabled: true
    },
    data: {
        csv: document.getElementById('csv').innerText
    },
    title: {
        text: 'Target vs Walmart Weekly Stock Prices'
    },
    subtitle: {
        text: 'Split adjusted, from Jan 2021 to Apr 2026.'
    },
    xAxis: {
        type: 'datetime',
        crosshair: true,
        labels: { format: '{value:%Y}' }
    },
    yAxis: {
        min: 0,
        title: { text: 'Close Price (USD)' },
        labels: { format: '${value:,.0f}' }
    },
    plotOptions: {
        spline: {
            marker: {
                enabled: false
            }
        }
    },
    series: [{}, {
        dashStyle: 'shortdash'
    }],
    tooltip: {
        shared: true,
        valuePrefix: '$',
        valueDecimals: 2
    }
});
