const chart = Highcharts.chart('container', {
    title: {
        text: 'Price of one Bitcoin in USD'
    },
    subtitle: {
        text: 'Daily prices, source: Yahoo Finance'
    },
    chart: {
        type: 'spline'
    },
    accessibility: {
        screenReaderSection: {
            axisRangeDateFormat: '%B %Y',
            beforeChartFormat: ''
        },
        point: {
            dateFormat: '%b %e, %Y'
        }
    },
    sonification: {
        duration: 6000
    },
    exporting: {
        enabled: false
    },
    plotOptions: {
        series: {
            marker: {
                enabled: false
            }
        }
    },
    legend: {
        enabled: false
    },
    data: {
        csv: document.getElementById('data').textContent
    },
    yAxis: {
        title: {
            text: null
        },
        accessibility: {
            description: 'Price in USD'
        },
        labels: {
            format: '${value:,.0f}'
        },
        max: 80000
    },
    xAxis: {
        accessibility: {
            description: 'Time'
        },
        type: 'datetime'
    },
    tooltip: {
        valuePrefix: '$',
        stickOnContact: true
    }
});

chart.accessibility.addLineChartTextDescription();
chart.accessibility.addLineTrendControls();
