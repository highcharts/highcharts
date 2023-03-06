Highcharts.chart('left', {
    chart: {
        type: 'column',
        options3d: {
            enabled: true,
            alpha: 15,
            beta: 13,
            depth: 250,
            viewDistance: 5,
            frame: {
                bottom: {
                    size: 1,
                    color: '#EEE'
                }
            }
        }
    },
    title: {
        text: 'Stereographic chart'
    },
    plotOptions: {
        column: {
            grouping: false,
            depth: 50,
            groupZPadding: 50
        }
    },
    yAxis: {
        title: {
            text: null
        }
    },
    series: [{
        data: [2, 3, null, 4, 0, 5]
    }, {
        data: [4, null, 1, 2, 1, 3]
    }]
});

Highcharts.chart('right', {
    chart: {
        type: 'column',
        options3d: {
            enabled: true,
            alpha: 15,
            beta: 17,
            depth: 250,
            viewDistance: 5,
            frame: {
                bottom: {
                    size: 1,
                    color: '#EEE'
                }
            }
        }
    },
    title: {
        text: 'Stereographic chart'
    },
    plotOptions: {
        column: {
            grouping: false,
            depth: 50,
            groupZPadding: 50
        }
    },
    yAxis: {
        title: {
            text: null
        }
    },
    series: [{
        data: [2, null, 2, 4, 0, 5]
    }, {
        data: [4, 2, null, 2, 1, 3]
    }]
});
