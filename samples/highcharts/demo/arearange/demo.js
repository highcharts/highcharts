(async () => {
    const data = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/range.json'
    ).then(response => response.json());

    // Function to calculate the color based on temperature value
    const getTemperatureColor = temperature => {
        const minTemp = -20;
        const maxTemp = 30;
        const normalizedTemp = (temperature - minTemp) / (maxTemp - minTemp);
        const r = Math.round(255 - normalizedTemp * 255);
        const b = Math.round(255 * normalizedTemp);
        return `rgb(${r}, 0, ${b})`;
    };

    // Set color for each data point in the 'data' array
    data.forEach(point => {
        point.color = getTemperatureColor(point[1]);
    });

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
                    [0, getTemperatureColor(-20)],
                    [1, getTemperatureColor(30)]
                ]
            }
        }]
    });
})();
