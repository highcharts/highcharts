Highcharts.chart('container', {
    title: {
        text: 'Bergen Wind Forecast'
    },
    subtitle: {
        text:
        'Source: <a href="https://www.yr.no/en/details/graph/1-92416/Norway/Vestland/Bergen/Bergen">Norwegian Meteorological Institute</a>'
    },

    xAxis: {
        crosshair: true,
        type: 'datetime'
    },

    yAxis: {
        title: {
            text: null
        },
        labels: {
            format: '{text}m/s'
        }
    },

    tooltip: {
        crosshairs: true,
        shared: true,
        valueSuffix: 'm/s',
        xDateFormat: '%A, %b %e'
    },

    data: {
        csvURL:
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@24912efc85/samples/data/bergen-wind-prediction.csv',
        seriesMapping: [{ low: 0, high: 1 }, { y: 2 }],
        complete: function (options) {
            options.series[0].name = 'Possible wind';
            options.series[1].name = 'Expected wind';
        }
    },

    plotOptions: {
        series: {
            label: {
                connectorAllowed: false
            },
            marker: {
                enabled: false
            },
            pointStart: Date.UTC(2022, 3, 3, 15),
            pointInterval: 36e5 // one hour
        }
    },

    series: [
        {
            type: 'areasplinerange',
            color: {
                patternIndex: 0
            }
        },
        {
            type: 'spline',
            lineWidth: 3,
            color: '#AA00F2'
        }
    ]
});
