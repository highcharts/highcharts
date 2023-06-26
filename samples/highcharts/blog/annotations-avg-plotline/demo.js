(async () => {

    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-c.json'
    ).then(response => response.json());

    let minMax = {};

    function getMinMax(chart) {
        const yMin = Math.min.apply(
                null,
                chart.series[0].processedYData.slice(1, -1)
            ),
            yMax = Math.max.apply(
                null,
                chart.series[0].processedYData.slice(1, -1)
            ),
            maxIndex = chart.series[0].processedYData.indexOf(yMax),
            minIndex = chart.series[0].processedYData.indexOf(yMin);

        minMax = {
            xMin: chart.series[0].processedXData[minIndex],
            xMax: chart.series[0].processedXData[maxIndex],
            yMin,
            yMax
        };
    }

    Highcharts.stockChart('container', {
        chart: {
            zoomType: 'x'
        },

        xAxis: {
            type: 'datetime'
        },

        annotations: [{
            draggable: '',
            shapes: [{
                type: 'path',
                points: [
                    annotation => {
                        // Calculate once
                        getMinMax(annotation.chart);

                        return {
                            x: annotation.chart.xAxis[0].min,
                            xAxis: 0,
                            y: (minMax.yMin + minMax.yMax) / 2,
                            yAxis: 0
                        };
                    },
                    annotation => ({
                        x: annotation.chart.xAxis[0].max,
                        xAxis: 0,
                        y: (minMax.yMin + minMax.yMax) / 2,
                        yAxis: 0
                    })
                ]
            }],
            labels: [{
                point: () => ({
                    x: minMax.xMax,
                    xAxis: 0,
                    y: minMax.yMax,
                    yAxis: 0
                }),
                format: 'max: {y:.2f}'
            }, {
                point: () => ({
                    x: minMax.xMin,
                    xAxis: 0,
                    y: minMax.yMin,
                    yAxis: 0
                }),
                format: 'min: {y:.2f}'
            }, {
                point: annotation => ({
                    x: annotation.chart.xAxis[0].min + 10e7,
                    xAxis: 0,
                    y: (minMax.yMin + minMax.yMax) / 2,
                    yAxis: 0
                }),
                y: 11,
                x: 30,
                clip: false,
                overflow: 'none',
                format: 'avg: {y:.2f}'
            }]
        }],
        series: [{
            data: data
        }]
    });
})();