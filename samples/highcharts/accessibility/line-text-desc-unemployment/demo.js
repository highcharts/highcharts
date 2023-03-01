const chart = Highcharts.chart('container', {
    title: {
        text: 'Unemployment rate last 20 years',
        align: 'left'
    },
    subtitle: {
        text: 'Shown in % of labor force',
        align: 'left'
    },
    chart: {
        type: 'spline',
        marginTop: 70
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
        duration: 18000
    },
    exporting: {
        enabled: false
    },
    plotOptions: {
        series: {
            label: {
                connectorAllowed: true
            },
            marker: {
                enabled: false
            }
        }
    },
    data: {
        csv: document.getElementById('csv').textContent
    },
    yAxis: {
        title: {
            text: null
        },
        accessibility: {
            description: 'Percent unemployment of labor force'
        },
        labels: {
            format: '{value:,.0f}%'
        },
        max: 15
    },
    xAxis: {
        accessibility: {
            description: 'Time'
        },
        type: 'datetime'
    },
    tooltip: {
        valueSuffix: '%',
        stickOnContact: true
    },
    legend: {
        enabled: false
    }
});

chart.accessibility.addLineChartTextDescription();
chart.accessibility.addLineTrendControls();
