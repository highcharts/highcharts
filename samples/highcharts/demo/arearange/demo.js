// https://veret.gfi.uib.no/

Highcharts.chart('container', {
    data: {
        csvURL: 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@31c9ab8/samples/data/TempFloridaBergen2023.csv',
        beforeParse: function (csv) {
            return csv.replace(/\n\n/g, '\n');
        }
    },
    chart: {
        type: 'arearange',
        zooming: {
            type: 'x'
        },
        scrollablePlotArea: {
            minWidth: 600,
            scrollPositionX: 1
        }
    },
    title: {
        text: 'Temperature variation by day',
        align: 'left'
    },
    subtitle: {
        text: 'Source: ' +
            '<a href="https://veret.gfi.uib.no/"' +
            'target="_blank">Universitetet i Bergen</a>',
        align: 'left'
    },
    xAxis: {
        type: 'datetime',
        accessibility: {
            rangeDescription: 'Range: Jan 1st 2023 to Jan 1st 2024.'
        }
    },
    yAxis: {
        title: {
            text: null
        }
    },
    tooltip: {
        crosshairs: true,
        shared: true,
        valueSuffix: '°C',
        xDateFormat: '%A, %b %e'
    },
    legend: {
        enabled: false
    },
    series: [{
        name: 'Temperatures',
        color: {
            linearGradient: {
                x1: 0,
                x2: 0,
                y1: 0,
                y2: 1
            },
            stops: [
                [0, '#ff0000'],
                [1, '#0000ff']
            ]
        }
    }]
});