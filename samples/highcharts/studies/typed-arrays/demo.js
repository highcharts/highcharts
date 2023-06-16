const chart = Highcharts.chart('container', {
    series: [{
        // boostThreshold: 1,
        data: {
            x: new Uint8Array([0, 1, 3, 4]),
            y: new Uint8Array([4, 2, 5, 1]),
            z: new Uint8Array([2, 1, 4, 2])
        },
        type: 'line'
    }]
});
/*
setTimeout(() => {
    chart.series[0].addPoint([7, 2]);
}, 1234);
*/