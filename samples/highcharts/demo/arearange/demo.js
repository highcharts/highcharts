(async () => {
    const data = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/range.json'
    ).then(response => response.json());

    Highcharts.chart('container', {
        chart: {
            type: 'arearange',
            zoomType: 'x',
            scrollablePlotArea: {
                minWidth: 600,
                scrollPositionX: 1
            }
        },
        title: {
            text: 'Temperature variation by day'
        },
        xAxis: {
            type: 'datetime',
            accessibility: {
                rangeDescription: 'Range: Jan 1st 2017 to Dec 31 2017.'
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
            }
        }]
    });
})();
