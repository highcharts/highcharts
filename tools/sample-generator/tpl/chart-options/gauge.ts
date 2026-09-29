export default {
    chart: {
        type: 'gauge'
    },
    yAxis: {
        min: 0,
        max: 100,
        plotBands: [{
            from: 50,
            to: 70,
            color: '#ffbf00'
        }, {
            from: 70,
            to: 100,
            color: '#00a96b'
        }]
    },
    series: [{
        data: [80]
    }]
};
