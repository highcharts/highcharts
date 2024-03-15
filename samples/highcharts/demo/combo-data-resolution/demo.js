Highcharts.chart('container', {
    title: {
        text: 'Global temperature mean anomalies from 1880 to 2016',
        align: 'left'
    },
    accessibility: {
        description: `
            A chart of monthly mean temperature anomalies from 1880 to 2016.
            It employs two series, one column and one line,
            to convey the same data at different resolutions.
            There is only one column per thirty years,
            but the line series have a datapoint per year.
        `
    },
    series: [{
        type: 'column',
        name: 'Average per thirty years',
        data: JSON.parse(document.getElementById('columnData').textContent)
    }, {
        name: 'Monthly average',
        data: JSON.parse(document.getElementById('lineData').textContent),
        description: `
            A data series illustrating the same data as the first,
            but at different time intervals
        `
    }],
    tooltip: {
        valueSuffix: '°C',
        valueDecimals: 2
    },
    yAxis: {
        description: 'temperature',
        minPadding: 0,
        maxPadding: 0,
        labels: {
            format: '{value:.1f}°C'
        },
        name: 'Temperature anomalies',
        title: {
            enabled: false
        }
    },
    xAxis: {
        endOnTick: true,
        type: 'datetime'
    }
});