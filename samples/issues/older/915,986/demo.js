Highcharts.chart('container', {
    chart: {
        type: 'column',
        width: 300
    },
    series: [{
        name: "aaa",
        data: [7]
    }, {
        name: "bbb",
        data: [0]
    }, {
        name: "A really really really really  long name this text should " +
            "have ellipsis",
        data: [13]
    }, {
        name: "ccc",
        data: [19]
    }]
});