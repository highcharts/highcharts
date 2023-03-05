const chart = Highcharts.chart('container', {
    title: {
        text: 'Crypto coin prices in USD'
    },
    subtitle: {
        text: 'Source: Yahoo Finance'
    },
    accessibility: {
        screenReaderSection: {
            axisRangeDateFormat: '%B %Y',
            beforeChartFormat: ''
        },
        point: {
            dateFormat: '%b %e, %Y',
            valueDescriptionFormat: '{value}{separator}{xDescription}'
        }
    },
    sonification: {
        duration: 18000
    },
    exporting: {
        enabled: false
    },
    plotOptions: {
        series: {
            marker: {
                enabled: false
            }
        },
        cropThreshold: 10
    },
    data: {
        csv: document.getElementById('csv').textContent
    },
    yAxis: {
        title: {
            text: ''
        },
        accessibility: {
            description: 'Price in USD'
        },
        labels: {
            format: '${value}'
        }
    },
    xAxis: {
        accessibility: {
            description: 'Time'
        },
        type: 'datetime'
    },
    tooltip: {
        valuePrefix: '$'
    }
});

chart.accessibility.addLineChartTextDescription();
chart.accessibility.addLineTrendControls();
