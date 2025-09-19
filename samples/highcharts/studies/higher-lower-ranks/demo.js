Highcharts.stockChart('container', {
    chart: {
        width: 800
    },
    series: [{
        id: 'main',
        type: 'line',
        data: Array.from({ length: 50 }, () => Math.random() * 10),
        pointInterval: 1000
    }],
    xAxis: {
        dateTimeLabelFormats: {
            day: {
                higherRank: '%e. %b - %H:%M'
            }
        }
    }
});

Highcharts.stockChart('container1', {
    chart: {
        width: 800
    },
    series: [{
        id: 'main',
        type: 'line',
        data: Array.from({ length: 50 }, () => Math.random() * 10),
        pointInterval: 2600000000
    }],
    xAxis: {
        dateTimeLabelFormats: {
            year: {
                higherRank: '%Y'
            },
            month: {
                lowerRank: '%b'
            }
        }
    }
});