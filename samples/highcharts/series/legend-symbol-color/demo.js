(async () => {
    const data = await fetch(
        'https://www.highcharts.com/samples/data/range.json'
    ).then(response => response.json());

    Highcharts.chart('container', {
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
            text: 'Temperature variation by day'
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            title: {
                text: ''
            }
        },
        tooltip: {
            crosshairs: true,
            shared: true,
            valueSuffix: '°C',
            xDateFormat: '%A, %b %e'
        },
        series: [{
            name: 'Temperatures',
            data: data,
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
            },
            legendSymbolColor: '#880088' // change legend symbol color
        }]
    });
})();
