const data = Array.from({ length: 50 }, () => Math.random() * 10);

Highcharts.stockChart('container', {
    chart: {
        width: 800
    },
    series: [{
        id: 'main',
        type: 'line',
        data,
        pointInterval: 10000
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
        data,
        pointInterval: 2600000000
    }],
    xAxis: {
        dateTimeLabelFormats: {
            month: {
                higherRank: '%Y',
                main: '%b'
            }
        }
    }
});