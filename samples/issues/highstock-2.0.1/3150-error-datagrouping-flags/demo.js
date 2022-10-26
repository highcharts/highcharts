var data = [];

for (var i = 0; i < 100; i++) {
    data[i] = i;
}

Highcharts.stockChart('container', {
    series: [{
        data: data,
        type: 'flags',
        allowOverlapX: true,
        dataGrouping: {
            enabled: true,
            groupPixelWidth: 10,
            units: [
                ['second', 86400]
            ]
        }
    }]
});