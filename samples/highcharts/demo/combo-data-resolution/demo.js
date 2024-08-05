Highcharts.chart('container', {
    title: {
        text: 'Global temperature changes from 1880 to 2021',
        align: 'left'
    },
    accessibility: {
        description: `
            A chart of global temperature change from 1880 to 2021.
            It employs two series, one column and one line,
            to convey the same data at different resolutions.
            There is only one column per thirty years,
            but the line series have a datapoint per year.
        `
    },
    series: [{
        type: 'column',
        name: 'Mean per thirty years',
        data: JSON.parse(document.getElementById('columnData').textContent),
        pointRange: 30 * 365 * 24 * 36e5,
        groupPadding: 0,
        pointPadding: 0,
        pointPlacement: -0.5,
        tooltip: {
            // Subtract 30 years from the year to get the start of the period
            headerFormat: (
                '<span style="font-size: 0.8em;">' +
                '{subtract (point.x:%Y) 30} - {point.x:%Y}</span><br>'
            )
        }
    }, {
        name: 'Annual mean',
        data: JSON.parse(document.getElementById('lineData').textContent),
        accessibility: {
            description: `
                A data series illustrating the same data as the first,
                but at different time intervals
            `
        }
    }],
    tooltip: {
        valueSuffix: '°C',
        valueDecimals: 2
    },
    yAxis: {
        accessibility: {
            description: 'temperature'
        },
        minPadding: 0,
        maxPadding: 0,
        labels: {
            format: '{value:.1f}°C'
        },
        name: 'Temperature change',
        title: {
            text: 'Temp anomaly (compared to 1951-1980 Avg.), from 1880 to 2021'
        }
    },
    xAxis: {
        endOnTick: true,
        type: 'datetime'
    }
});