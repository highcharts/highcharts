const milliSecPerYear = 365.25 * 24 * 60 * 60 * 1000;

Highcharts.chart('container', {
    title: {
        text: 'Annual surface temperature change from 1961 to 2022',
        align: 'left'
    },
    accessibility: {
        description: `
            A chart of annual surface temperature change from 1961 to 2022.
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

        tooltip: {
            // Subtract 30 years from the year to get the start of the period
            headerFormat: (
                '<span>{(subtract point.x 946684800000):%Y} - {point.x:%Y}<br>'
            )
        }
    }, {
        name: 'Yearly mean',
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
        name: 'Temperature change',
        title: {
            enabled: false
        }
    },
    xAxis: {
        endOnTick: true,
        type: 'datetime'
    }
});