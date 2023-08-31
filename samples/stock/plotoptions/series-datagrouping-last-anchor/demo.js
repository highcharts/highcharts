Highcharts.stockChart('container', {
    chart: {
        height: 600,
        events: {
            load: function () {
                const chart = this,
                    rawSeries = chart.series[0],
                    groupedSeries = chart.series[1];

                setInterval(function () {
                    const randomNumber = Math.random() * 5;

                    rawSeries.addPoint(randomNumber, false);
                    groupedSeries.addPoint(randomNumber);
                }, 1000);
            }
        }
    },
    yAxis: [{
        height: '50%',
        offset: 0,
        min: 0,
        max: 5,
        title: {
            text: 'Raw data'
        }
    }, {
        height: '50%',
        top: '50%',
        offset: 0,
        min: 0,
        max: 5,
        title: {
            text: 'Last anchor set to last point'
        }
    }],
    series: [{
        data: [5, 4, 4, 3, 5, 3, 2, 1, 2, 3, 1, 2, 2, 1, 3],
        dataGrouping: {
            enabled: false
        }
    }, {
        data: [4, 3, 4, 3, 5, 3, 2, 1, 2, 3, 1, 2, 2, 1, 3],
        yAxis: 1,
        dataGrouping: {
            approximation: 'average',
            enabled: true,
            forced: true,
            units: [
                ['millisecond', [5]]
            ],
            lastAnchor: 'lastPoint'
        }
    }]
});
