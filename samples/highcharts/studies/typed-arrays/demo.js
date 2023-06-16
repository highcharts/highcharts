Highcharts.chart('container', {
    series: [{
        // boostThreshold: 1,
        data: {
            x: new Uint8Array([0, 1, 3, 4]),
            y: new Uint8Array([4, 2, 5, 1])
        },
        type: 'column'
    }]
});